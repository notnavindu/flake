import { FirebaseAdminBase } from '$lib/models/FirebaseAdminBase';
import { HostFirebaseAdmin, decodeToken } from '$lib/server/firebase';
import { error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ request, cookies, url }) => {
	const decodedToken = await decodeToken(cookies.get('token') || '');

	if (!decodedToken) {
		throw error(401, 'Not logged in');
	}
	const uid = decodedToken.uid;
	const body = await request.json();

	const serviceAccount = body.account;

	try {
		const clientApp = new FirebaseAdminBase(serviceAccount.project_id, serviceAccount);

		await clientApp.firestore.collection('test').doc('test').set({ this: true });
		await clientApp.firestore.collection('test').doc('test').delete();

		await clientApp.deleteInstance();

		// TODO: Encrypt with AES
		await Promise.all([
			HostFirebaseAdmin.firestore
				.collection('service-accounts')
				.doc(`${uid}`)
				.set({
					serviceAccount: JSON.stringify(serviceAccount)
				}),

			HostFirebaseAdmin.auth.setCustomUserClaims(uid, { setupComplete: true })
		]);
	} catch (err) {
		throw error(400, 'Invalid Service Account');
	}

	return new Response(JSON.stringify({ success: true }));
};
