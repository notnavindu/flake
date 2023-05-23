import { browser } from '$app/environment';
import admin from 'firebase-admin';
import type { App, ServiceAccount } from 'firebase-admin/app';
import { initializeApp, type AppOptions } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { getStorage } from 'firebase-admin/storage';

export class FirebaseAdminBase {
	app: App;

	constructor(projectId: string, options: ServiceAccount) {
		if (browser) throw 'Cannot be used on client';

		console.log('APPS LENGTH: ', admin.apps.length);
		let app = admin.apps.find((app) => app?.name === projectId);

		if (!app) {
			this.app = initializeApp(
				{
					credential: admin.credential.cert(options),
					storageBucket: `${projectId}.appspot.com`
				},
				projectId
			);
		} else {
			console.log('Created app');
			this.app = app;
		}
	}

	get firestore() {
		return getFirestore(this.app);
	}

	get storage() {
		return getStorage(this.app);
	}

	get auth() {
		return admin.auth(this.app);
	}

	deleteInstance() {
		// try {
		// 	deleteApp(this.app);
		// } catch (error) {
		// 	console.log('error deleting app');
		// }
	}
}
