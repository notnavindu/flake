import { initializeApp, type FirebaseApp, type FirebaseOptions } from 'firebase/app';
import { getFirestore, type Firestore } from 'firebase/firestore';

export class FirebaseBase {
	#options: FirebaseOptions;
	app: FirebaseApp;
	firestore: Firestore;

	constructor(options: FirebaseOptions) {
		this.#options = options;
		this.app = initializeApp(options);
		this.firestore = getFirestore(this.app);
	}
}
