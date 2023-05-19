import type { Fetch, UserSession } from '$lib/models/types';
import { createDocument, decodeToken, getDocuments } from '$lib/server/firebase.js';
import { error, type Cookies } from '@sveltejs/kit';

async function getUserCountData(cookies: Cookies, url: URL): Promise<Partial<UserSession>> {
	const decodedToken = await decodeToken(cookies.get('token') || '');
	if (!decodedToken) {
		throw error(401, 'Not logged in');
	}
	const uid = decodedToken.uid;

	const docs = await getDocuments('counter', uid);

	if (!docs.length) {
		const doc = await createDocument('counter', uid);
		docs.push(doc);
	}

	return docs[0];
}

/** @type {import('./$types').PageServerLoad} */
export async function load({ fetch, parent, cookies, url }) {
	const parentData = await parent();
	let userCountData = parentData.userSession ? await getUserCountData(cookies, url) : undefined;

	console.log(userCountData);
	return {
		userCountData
	};
}
