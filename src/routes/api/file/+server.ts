import {
	HostFirebaseAdmin,
	decodeToken,
	initializeCustomFirebaseAppOfUser
} from '$lib/server/firebase';
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
	const name = decodedToken.name;

	const customAdminApp = await initializeCustomFirebaseAppOfUser(uid);

	const rawFile = (await request.formData()).get('media') as Blob;
	const buffer = Buffer.from(await rawFile.arrayBuffer());

	// TODO: @Nav: check size & mime type
	const size = rawFile.size / 1024 / 1024;
	console.log('size ==>', size, 'MB');

	if (size > 30) {
		throw error(400, 'Size cannot be larger than 30MB');
	}

	const hostDocRef = HostFirebaseAdmin.firestore.collection('flakes').doc();
	const customDocRef = customAdminApp.firestore.collection('flakes').doc(hostDocRef.id);
	const fileName = `flakes/${uid}/${hostDocRef.id}`;
	const fileRef = customAdminApp.storage.bucket().file(fileName);

	await fileRef.save(buffer, {
		contentType: rawFile.type,
		public: true,
		gzip: true
	});

	const metadata = (await fileRef.getMetadata())[0];

	/**
	 * This may not be the best approach for this. we are storing redundant data
	 * This is to speed up the video retrieval speed
	 *
	 * Retrieval process --
	 * Currently: Host Firestore -> video data
	 * Second option: Host Firebase -> uid -> Host Firebase -> service account -> Client Firebase -> video data
	 */
	await Promise.all([
		customDocRef.set({
			id: hostDocRef.id,
			createdAt: new Date(),
			downloadUrl: metadata.mediaLink,
			fileSize: metadata.size,
			uploadedBy: uid,
			uploadedByName: name,
			name: dayjs().format('YYYY MMM D HHm[h]')
		}),

		hostDocRef.set({
			id: hostDocRef.id,
			createdAt: new Date(),
			downloadUrl: metadata.mediaLink,
			uploadedBy: uid,
			uploadedByName: name,
			name: dayjs().format('YYYY MMM D HHm[h]')
		})
	]);

	console.timeEnd('file-upload');

	return new Response(JSON.stringify({ id: customDocRef.id }));
};
