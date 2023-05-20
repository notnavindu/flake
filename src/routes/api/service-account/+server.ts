import { createDocument, getDocuments, decodeToken } from '$lib/server/firebase';
import { error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import admin from 'firebase-admin';

export const POST: RequestHandler = async ({ request, cookies, url }) => {
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
	} catch (error) {
		throw 'Invalid Service Account';
	}

	return new Response(JSON.stringify({ success: true }));
};
