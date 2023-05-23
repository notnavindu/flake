import {
	HostFirebaseAdmin,
	decodeToken,
	initializeCustomFirebaseAppOfUser
} from '$lib/server/firebase';
import { error } from '@sveltejs/kit';
import admin from 'firebase-admin';
import type { RequestHandler } from './$types.js';

// export const GET: RequestHandler = async ({ request, cookies, url }) => {
// 	const decodedToken = await decodeToken(cookies.get('token') || '');

// 	if (!decodedToken) {
// 		throw error(401, 'Not logged in');
// 	}
// 	const uid = decodedToken.uid;

// 	console.log(admin.apps[0]?.options);

// 	return new Response(JSON.stringify({ success: true }));
// };

export const PATCH: RequestHandler = async ({ request, cookies, params }) => {
	const decodedToken = await decodeToken(cookies.get('token') || '');

	if (!decodedToken) {
		throw error(401, 'Not logged in');
	}

	const uid = decodedToken.uid;
	const videoId = params.videoId;

	const { name } = await request.json();
	const customAdminApp = await initializeCustomFirebaseAppOfUser(uid);

	await Promise.all([
		customAdminApp.firestore.collection('flakes').doc(videoId).update({ name }),
		HostFirebaseAdmin.firestore.collection('flakes').doc(videoId).update({ name })
	]);

	return new Response(JSON.stringify({ success: true }));
};

export const DELETE: RequestHandler = async ({ request, cookies, params }) => {
	const decodedToken = await decodeToken(cookies.get('token') || '');

	if (!decodedToken) {
		throw error(401, 'Not logged in');
	}

	const uid = decodedToken.uid;
	const videoId = params.videoId;
	const fileName = `flakes/${uid}/${videoId}`;
	const customAdminApp = await initializeCustomFirebaseAppOfUser(uid);

	await Promise.all([
		customAdminApp.firestore.collection('flakes').doc(videoId).delete(),
		HostFirebaseAdmin.firestore.collection('flakes').doc(videoId).delete(),
		customAdminApp.storage.bucket().file(fileName).delete()
	]);

	return new Response(JSON.stringify({ success: true }));
};
