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

	const file = (await request.formData()).get('media') as Blob;

	console.log('TYPE: ', file.type);

	const buffer = Buffer.from(await file.arrayBuffer());

	const bucket = getStorage().bucket('flake-async.appspot.com').file('this shit work pls pt 2');
	const test = await bucket.save(buffer, {
		contentType: file.type,
		public: true
	});

	console.log(await bucket.getMetadata());

	return new Response(JSON.stringify({ a: 's' }));
};
