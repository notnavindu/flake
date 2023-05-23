import { decodeToken, initializeCustomFirebaseAppOfUser } from '$lib/server/firebase';
import { error } from '@sveltejs/kit';
import admin from 'firebase-admin';

// export const POST: RequestHandler = async ({ request, cookies, url }) => {
// 	const decodedToken = await decodeToken(cookies.get('token') || '');

// 	if (!decodedToken) {
// 		throw error(401, 'Not logged in');
// 	}
// 	const uid = decodedToken.uid;

// 	const { serviceAccount } = (
// 		await getFirestore().collection('service-accounts').doc(uid).get()
// 	).data() as { serviceAccount: string };

// 	const serviceAccountParsed = JSON.parse(serviceAccount);

// 	const userApp = initializeApp(
// 		{
// 			credential: credential.cert(serviceAccountParsed),
// 			databaseURL: `https://${serviceAccountParsed.project_id}.firebaseio.com`,
// 			storageBucket: `${serviceAccountParsed.project_id}.appspot.com`
// 		},
// 		serviceAccountParsed.project_id
// 	);

// 	await userApp.delete();

// 	return new Response(JSON.stringify({ success: true }));
// };

export const GET = async ({ request, cookies, url }) => {
	const decodedToken = await decodeToken(cookies.get('token') || '');

	if (!decodedToken) {
		throw error(401, 'Not logged in');
	}
	const uid = decodedToken.uid;

	console.log(admin.apps[0]?.options);

	return new Response(JSON.stringify({ success: true }));
};

/** @type {import('./$types').RequestHandler} */
export const DELETE = async ({ request, cookies, params }) => {
	const decodedToken = await decodeToken(cookies.get('token') || '');

	if (!decodedToken) {
		throw error(401, 'Not logged in');
	}
	const uid = decodedToken.uid;

	const videoId = params.videoId;

	const customAdminApp = await initializeCustomFirebaseAppOfUser(uid);

	customAdminApp.firestore.collection('flakes').doc();

	return new Response(JSON.stringify({ success: true }));
};
