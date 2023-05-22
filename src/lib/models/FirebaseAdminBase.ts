import { browser } from '$app/environment';
import { app, apps, auth, credential } from 'firebase-admin';
import { deleteApp, type App, type ServiceAccount } from 'firebase-admin/app';
import { initializeApp, type AppOptions } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { getStorage } from 'firebase-admin/storage';

export class FirebaseAdminBase {
	app: App;

	constructor(projectId: string, options: ServiceAccount) {
		if (browser) throw 'Cannot be used on client';

		let app = apps.find((app) => app?.name === projectId);

		if (!app) {
			this.app = initializeApp(
				{
					credential: credential.cert(options)
				},
				projectId
			);
		} else {
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
		return auth(this.app);
	}

	deleteInstance() {
		try {
			deleteApp(this.app);
		} catch (error) {
			console.log('error deleting app');
		}
	}
}
