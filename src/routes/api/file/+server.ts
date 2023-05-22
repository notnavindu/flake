import { decodeToken, initializeCustomFirebaseAppOfUser } from '$lib/server/firebase';
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

	const customAdminApp = await initializeCustomFirebaseAppOfUser(uid);

	const fileName = `flakes/${uid}/${new Date().toISOString()}`;
	const rawFile = (await request.formData()).get('media') as Blob;
	const buffer = Buffer.from(await rawFile.arrayBuffer());

	// TODO: @Nav: check size & mime type
	const size = rawFile.size / 1024 / 1024;
	console.log('size ==>', size, 'MB');

	if (size > 30) {
		throw error(400, 'Size cannot be larger than 30MB');
	}

	const fileRef = customAdminApp.storage.bucket().file(fileName);

	await fileRef.save(buffer, {
		contentType: rawFile.type,
		public: true,
		gzip: true
	});

	const metadata = (await fileRef.getMetadata())[0];

	const docRef = customAdminApp.firestore.collection('flakes').doc();

	await docRef.set({
		id: docRef.id,
		createdAt: new Date(),
		downloadUrl: metadata.mediaLink,
		fileSize: metadata.size,
		uploadedBy: uid,
		name: dayjs().format('YYYY MMM D HHm[h]')
	});

	await customAdminApp.deleteInstance();

	console.timeEnd('file-upload');

	return new Response(JSON.stringify({ id: docRef.id }));
};
