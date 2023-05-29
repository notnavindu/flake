import { FirebaseAdminBase } from '$lib/models/FirebaseAdminBase';
import {
	HostFirebaseAdmin,
	decodeToken,
	initializeCustomFirebaseAppOfUser
} from '$lib/server/firebase';
import { error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ request, cookies, url }) => {
	const decodedToken = await decodeToken(cookies.get('token') || '');

	if (!decodedToken) {
		throw error(401, 'Not logged in');
	}
	const uid = decodedToken.uid;

	const userDoc = (await HostFirebaseAdmin.firestore.collection('users').doc(uid).get()).data();

	return new Response(JSON.stringify({ deepgramSetup: userDoc?.deepgramSetup ?? false }));
};

export const POST: RequestHandler = async ({ request, cookies, url }) => {
	const decodedToken = await decodeToken(cookies.get('token') || '');

	if (!decodedToken) {
		throw error(401, 'Not logged in');
	}

	const uid = decodedToken.uid;

	const { secret } = await request.json();
	const customAdminApp = await initializeCustomFirebaseAppOfUser(uid);

	await Promise.all([
		customAdminApp.firestore.collection('deepgram').doc(uid).set({ secret: secret }),
		HostFirebaseAdmin.firestore.collection('users').doc(uid).update({ deepgramSetup: true })
	]);

	return new Response(JSON.stringify({ success: true }));
};
