import { browser } from '$app/environment';
import { goto, invalidateAll } from '$app/navigation';
import { FirebaseClientBase } from '$lib/models/FirebaseBase';
import { singInLoading } from '$lib/stores/loaders.store';
import type { FirebaseOptions } from 'firebase/app';
import {
	GoogleAuthProvider,
	signOut as _signOut,
	getAuth,
	onIdTokenChanged,
	signInWithPopup
} from 'firebase/auth';

export let HostFirebase: FirebaseClientBase;

// export let app: FirebaseApp;
// export let db: Firestore;

async function setToken(token: string) {
	const options = {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json;charset=utf-8'
		},
		body: JSON.stringify({ token })
	};

	await fetch('/api/token', options);
}

function listenForAuthChanges() {
	const auth = getAuth(HostFirebase.app);

	onIdTokenChanged(
		auth,
		async (user) => {
			if (user) {
				const token = await user.getIdToken();
				await setToken(token);
			} else {
				await setToken('');
			}
			await invalidateAll();
		},
		(err) => console.error(err.message)
	);
}

export async function refreshIdToken() {
	const auth = getAuth(HostFirebase.app);

	await auth.currentUser?.getIdToken(true);

	await invalidateAll();
}

export function initializeFirebase(options: FirebaseOptions) {
	if (!browser) {
		throw new Error("Can't use the Firebase client on the server.");
	}

	if (!HostFirebase?.app) {
		HostFirebase = new FirebaseClientBase(options);

		listenForAuthChanges();
	}
}

function providerFor(name: string) {
	switch (name) {
		case 'google':
			return new GoogleAuthProvider();
		default:
			throw 'unknown provider ' + name;
	}
}

export async function signInWith(name: string) {
	const auth = getAuth(HostFirebase.app);
	const provider = providerFor(name);

	singInLoading.set(true);

	signInWithPopup(auth, provider).then(async (res) => {
		await invalidateAll();

		singInLoading.set(false);
		console.log('signed in');

		goto('/profile');
	});
}

export async function signOut() {
	const auth = getAuth(HostFirebase.app);
	await _signOut(auth);
}
