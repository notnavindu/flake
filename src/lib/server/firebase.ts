import { AES_KEY, FIREBASE_SERVER_CONFIG } from '$env/static/private';
import { FirebaseAdminBase } from '$lib/models/FirebaseAdminBase';
import { AES } from 'crypto-js';
import Utf8 from 'crypto-js/enc-utf8';
import { getFirestore } from 'firebase-admin/firestore';
import type { DecodedIdToken } from 'firebase-admin/lib/auth/token-verifier';

export let HostFirebaseAdmin: FirebaseAdminBase;

export function initializeHostFirebase() {
	const serviceAccount = JSON.parse(FIREBASE_SERVER_CONFIG);
	HostFirebaseAdmin = new FirebaseAdminBase(serviceAccount.project_id, serviceAccount);

	return HostFirebaseAdmin;
}

export async function initializeCustomFirebaseAppOfUser(uid: string) {
	initializeHostFirebase();
	const { serviceAccount } = (
		await getFirestore(HostFirebaseAdmin.app).collection('service-accounts').doc(uid).get()
	).data() as { serviceAccount: string };

	const serviceAccountDecrypted = AES.decrypt(serviceAccount, AES_KEY).toString(Utf8);

	const serviceAccountParsed = JSON.parse(serviceAccountDecrypted);

	return new FirebaseAdminBase(serviceAccountParsed.project_id, serviceAccountParsed);
}

export async function decodeToken(token: string): Promise<DecodedIdToken | null> {
	if (!token || token === 'null' || token === 'undefined') return null;

	try {
		initializeHostFirebase();
		return await HostFirebaseAdmin.auth.verifyIdToken(token);
	} catch (err) {
		return null;
	}
}
