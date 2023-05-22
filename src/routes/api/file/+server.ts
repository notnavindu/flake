import { decodeToken } from '$lib/server/firebase';
import { error } from '@sveltejs/kit';
import dayjs from 'dayjs';
import admin from 'firebase-admin';
import { getFirestore } from 'firebase-admin/firestore';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ request, cookies, url }) => {
	console.time('file-upload');
	const decodedToken = await decodeToken(cookies.get('token') || '');

	if (!decodedToken) {
		throw error(401, 'Not logged in');
	}
	const uid = decodedToken.uid;

	const { serviceAccount } = (
		await getFirestore().collection('service-accounts').doc(uid).get()
	).data() as { serviceAccount: string };

	const serviceAccountParsed = JSON.parse(serviceAccount);

	const userApp = admin.initializeApp(
		{
			credential: admin.credential.cert(serviceAccountParsed),
			databaseURL: `https://${serviceAccountParsed.project_id}.firebaseio.com`,
			storageBucket: `${serviceAccountParsed.project_id}.appspot.com`
		},
		serviceAccountParsed.project_id
	);

	const fileName = `flakes/${uid}/${new Date().toISOString()}`;
	const rawFile = (await request.formData()).get('media') as Blob;
	const buffer = Buffer.from(await rawFile.arrayBuffer());

	// TODO: @Nav: check size & mime type
	const size = rawFile.size / 1024 / 1024;
	console.log('size ==>', size, 'MB');

	// if (size > 30) {
	// 	throw error(400, 'Size cannot be larger than 30MB');
	// }

	const fileRef = userApp.storage().bucket().file(fileName);

	await fileRef.save(buffer, {
		contentType: rawFile.type,
		public: true,
		gzip: true
	});

	const metadata = (await fileRef.getMetadata())[0];

	const docRef = userApp.firestore().collection('flakes').doc();

	await docRef.set({
		id: docRef.id,
		createdAt: new Date(),
		downloadUrl: metadata.mediaLink,
		fileSize: metadata.size,
		uploadedBy: uid,
		name: dayjs().format('YYYY MMM D HHm[h]')
	});

	await userApp.delete();

	console.timeEnd('file-upload');

	return new Response(JSON.stringify({ id: docRef.id }));
};
