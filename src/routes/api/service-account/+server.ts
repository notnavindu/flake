import { FirebaseAdminBase } from '$lib/models/FirebaseAdminBase';
import { HostFirebaseAdmin, decodeToken } from '$lib/server/firebase';
import { error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import AES from 'crypto-js/aes';
import { AES_KEY } from '$env/static/private';
import { serviceAccountKeys } from '$lib/constants/validator.const';

export const POST: RequestHandler = async ({ request, cookies, url }) => {
	const decodedToken = await decodeToken(cookies.get('token') || '');

	if (!decodedToken) {
		throw error(401, 'Not logged in');
	}
	const uid = decodedToken.uid;
	const body = await request.json();

	const serviceAccount = body.account;

	const isValid = serviceAccountKeys.every((key) => serviceAccount[key]?.length > 0);

	if (!isValid) {
		throw error(400, 'Required fields missing from service account');
	}

	try {
		const clientApp = new FirebaseAdminBase(serviceAccount.project_id, serviceAccount);

		await clientApp.firestore.collection('test').doc('test').set({ this: true });
		await clientApp.firestore.collection('test').doc('test').delete();

		await clientApp.deleteInstance();

		const encryptedServiceAccount = AES.encrypt(JSON.stringify(serviceAccount), AES_KEY).toString();

		await Promise.all([
			HostFirebaseAdmin.firestore.collection('service-accounts').doc(`${uid}`).set({
				serviceAccount: encryptedServiceAccount
			}),

			HostFirebaseAdmin.firestore.collection('users').doc(`${uid}`).set({
				projectId: serviceAccount.project_id
			}),

			HostFirebaseAdmin.auth.setCustomUserClaims(uid, {
				setupComplete: true,
				connectedProjectId: serviceAccount.project_id
			})
		]);
	} catch (err) {
		throw error(400, 'Invalid Service Account');
	}

	return new Response(JSON.stringify({ success: true }));
};
