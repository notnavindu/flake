import { HostFirebaseAdmin, decodeToken } from '$lib/server/firebase';
import { error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ request, cookies, url }) => {
	const decodedToken = await decodeToken(cookies.get('token') || '');

	if (!decodedToken) {
		throw error(401, 'Not logged in');
	}
	const uid = decodedToken.uid;

	const userDoc = (await HostFirebaseAdmin.firestore.collection('users').doc(uid).get()).data();

	return new Response(JSON.stringify({ ...userDoc }));
};
