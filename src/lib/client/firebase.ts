import { browser } from '$app/environment';
import { goto, invalidateAll } from '$app/navigation';
import type { Document } from '$lib/models/Document';
import { FirebaseBase } from '$lib/models/FirebaseBase';
import type { AnyObject } from '$lib/models/types';
import { singInLoading } from '$lib/stores/loaders.store';
import type { FirebaseApp, FirebaseOptions } from 'firebase/app';
import { initializeApp } from 'firebase/app';
import {
	GoogleAuthProvider,
	signOut as _signOut,
	getAuth,
	onIdTokenChanged,
	signInWithPopup
} from 'firebase/auth';
import {
	addDoc,
	collection,
	deleteDoc,
	doc,
	getFirestore,
	onSnapshot,
	query,
	setDoc,
	where,
	type Firestore
} from 'firebase/firestore';
import { readable } from 'svelte/store';

export let HostFirebase: FirebaseBase;

export let app: FirebaseApp;
export let db: Firestore;

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
	const auth = getAuth(app);

	onIdTokenChanged(
		auth,
		async (user) => {
			if (user) {
				console.log('HAS USER');

				const token = await user.getIdToken();
				await setToken(token);
			} else {
				console.log('NO AUTH USER');

				await setToken('');
			}
			await invalidateAll();
		},
		(err) => console.error(err.message)
	);
}

export async function refreshIdToken() {
	const auth = getAuth(app);

	await auth.currentUser?.getIdToken(true);

	await invalidateAll();
}

export function initializeFirebase(options: FirebaseOptions) {
	if (!browser) {
		throw new Error("Can't use the Firebase client on the server.");
	}
	if (!app) {
		HostFirebase = new FirebaseBase(options);

		// DEPRECATED
		app = initializeApp(options);
		db = getFirestore(app);

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
	const auth = getAuth(app);
	const provider = providerFor(name);

	singInLoading.set(true);

	signInWithPopup(auth, provider).then((res) => {
		singInLoading.set(false);

		console.log(res);

		goto('/profile');
	});
}

export async function signOut() {
	const auth = getAuth(app);
	await _signOut(auth);
}
