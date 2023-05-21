import { decodeToken } from '$lib/server/firebase';
import { error } from '@sveltejs/kit';
import dayjs from 'dayjs';
import { credential, initializeApp } from 'firebase-admin';
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

	const userApp = initializeApp(
		{
			credential: credential.cert(serviceAccountParsed)
		},
		serviceAccountParsed.project_id
	);

	let doc = (await userApp.firestore().collection('flakes').doc(params.videoId).get()).data();

	if (!doc) throw error(404, 'Invalid Video Id');

	await userApp.delete();

	return {
		data: {
			id: doc.id,
			downloadUrl: doc.downloadUrl,
			name: dayjs().format('YYYY MMM HHmm[h]')
		}
	};
}
