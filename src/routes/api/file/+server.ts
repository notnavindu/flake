import { createDocument, getDocuments, decodeToken } from '$lib/server/firebase';
import { error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { getStorage } from 'firebase-admin/storage';

export const POST: RequestHandler = async ({ request, cookies, url }) => {
	const decodedToken = await decodeToken(cookies.get('token') || '');
	if (!decodedToken) {
		throw error(401, 'Not logged in');
	}
	const uid = decodedToken.uid;

	const fileName = `/flakes/${uid}/`;
	const rawFile = (await request.formData()).get('media') as Blob;
	const buffer = Buffer.from(await rawFile.arrayBuffer());

	// TODO: @Nav: check size
	// console.log('size', rawFile.size / 1024 / 1024, 'MB');

	const fileRef = getStorage().bucket('flake-async.appspot.com').file('this shit work pls pt 2');

	console.log('starting upload');
	await fileRef.save(buffer, {
		contentType: rawFile.type,
		public: true,
		gzip: true
	});

	console.log(await fileRef.getMetadata());

	return new Response(JSON.stringify({ a: 's' }));
};
