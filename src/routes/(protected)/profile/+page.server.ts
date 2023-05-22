import type { Video } from '$lib/models/types.js';
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

	let customAdminApp = await initializeCustomFirebaseAppOfUser(uid);

	let data = (await customAdminApp.firestore.collection('flakes').get()).docs.map((doc) => {
		return {
			...doc.data(),
			createdAt: doc.data().createdAt.toDate()
		} as Video;
	});

	await customAdminApp.deleteInstance();

	if (!data) throw error(404, 'Invalid Video Id');

	return {
		videos: data
	};
}
