import { decodeToken, initializeCustomFirebaseAppOfUser } from '$lib/server/firebase';
import { error } from '@sveltejs/kit';
import dayjs from 'dayjs';
import { getFirestore } from 'firebase-admin/firestore';

/** @type {import('./$types').PageServerLoad} */
export async function load({ params, cookies }) {
	const decodedToken = await decodeToken(cookies.get('token') || '');
	if (!decodedToken) {
		throw error(401, 'Not logged in');
	}
	const uid = decodedToken.uid;

	let userApp = await initializeCustomFirebaseAppOfUser(uid);

	let doc = (await userApp.firestore.collection('flakes').doc(params.videoId).get()).data();

	await userApp.deleteInstance();

	if (!doc) throw error(404, 'Invalid Video Id');

	return {
		data: {
			id: doc.id,
			downloadUrl: doc.downloadUrl,
			name: doc.name,
			uploadedBy: doc.uploadedBy
		}
	};
}
