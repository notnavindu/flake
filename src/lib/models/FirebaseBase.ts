import { initializeApp, type FirebaseOptions } from 'firebase/app';

export class FirebaseClientBase {
	#options: FirebaseOptions;
	public app;

	constructor(options: FirebaseOptions) {
		this.#options = options;
		this.app = initializeApp(options);
	}
}
