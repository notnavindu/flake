import { initializeApp, type FirebaseApp, type FirebaseOptions } from 'firebase/app';
import { getFirestore, type Firestore } from 'firebase/firestore';

export class FirebaseClientBase {
	#options: FirebaseOptions;
	public app;

	constructor(options: FirebaseOptions) {
		this.#options = options;
		this.app = initializeApp(options);
	}
}
