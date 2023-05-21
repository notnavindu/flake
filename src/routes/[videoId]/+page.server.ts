import { decodeToken, initializeCustomFirebaseApp } from '$lib/server/firebase';
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

	getFirestore().collection('service-accounts').doc('uid');

	const { serviceAccount } = (
		await getFirestore().collection('service-accounts').doc(uid).get()
	).data() as { serviceAccount: string };

	const serviceAccountParsed = JSON.parse(serviceAccount);

	let userApp = initializeCustomFirebaseApp(serviceAccountParsed);

	let doc = (await userApp.firestore().collection('flakes').doc(params.videoId).get()).data();
	await userApp.delete();

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