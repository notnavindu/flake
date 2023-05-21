import { createDocument, getDocuments, decodeToken } from '$lib/server/firebase';
import { error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import admin from 'firebase-admin';

export const POST: RequestHandler = async ({ request, cookies, url }) => {
	const mainApp = admin.app();

	const decodedToken = await decodeToken(cookies.get('token') || '');
	if (!decodedToken) {
		throw error(401, 'Not logged in');
	}
	const uid = decodedToken.uid;
	const body = await request.json();

	const serviceAccount = body.account;

	try {
		const app = admin.initializeApp(
			{
				credential: admin.credential.cert(serviceAccount),
				databaseURL: `https://${serviceAccount.project_id}.firebaseio.com`
			},
			serviceAccount.project_id
		);

		await app.firestore().collection('test').doc('test').set({ this: true });
		await app.firestore().collection('test').doc('test').delete();

		await app.delete();

		// TODO: Encrypt with AES
		await Promise.all([
			mainApp
				.firestore()
				.collection('service-accounts')
				.doc(`${uid}`)
				.set({
					serviceAccount: JSON.stringify(serviceAccount)
				}),

			mainApp.auth().setCustomUserClaims(uid, { setupComplete: true })
		]);
	} catch (err) {
		throw error(400, 'Invalid Service Account');
	}

	return new Response(JSON.stringify({ success: true }));
};
