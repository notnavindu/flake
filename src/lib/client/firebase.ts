import { browser } from '$app/environment';
import { invalidateAll } from '$app/navigation';
import type { Document } from '$lib/models/Document';
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

	console.log(auth.currentUser);
}

export let app: FirebaseApp;
export let db: Firestore;

export function initializeFirebase(options: FirebaseOptions) {
	console.log('staring');
	if (!browser) {
		throw new Error("Can't use the Firebase client on the server.");
	}
	if (!app) {
		app = initializeApp(options);
		db = getFirestore(app);
		listenForAuthChanges();
		console.log('loaded');
	}
}

function getDbObject(document: Document): Partial<Document> {
	const obj: AnyObject = {};
	console.log(document._dbFields);
	Object.keys(document)
		.filter((k) => document._dbFields.includes(k))
		.forEach((k) => {
			obj[k] = document[k as keyof Document];
		});
	return obj;
}

export async function saveDocument(document: Document) {
	console.log(document);
	const dbObject = getDbObject(document);
	if (!document._collection) throw Error('Objects that extends Document must specify __collection');

	if (document._id) {
		await setDoc(doc(db, document._collection, document._id), dbObject);
	} else {
		const todoRef = await addDoc(collection(db, document._collection), dbObject);
		document._id = todoRef.id;
	}
}

export function getDocumentStore<T extends Document>(
	type: { new (data: AnyObject): T },
	document: T,
	onDeleted: () => void = () => undefined
) {
	return readable<T>(document, (set) => {
		let dbUnsubscribe: () => void;
		let unsubbed = false;
		const unsub = () => {
			unsubbed = true;
			if (dbUnsubscribe) {
				dbUnsubscribe();
			}
		};
		if (browser) {
			(async () => {
				if (unsubbed) return;
				dbUnsubscribe = onSnapshot(doc(db, document._collection, document._id), (doc) => {
					if (doc.exists()) {
						const newDoc = new type(doc.data());
						newDoc._id = doc.id;
						set(newDoc);
					} else {
						onDeleted();
						dbUnsubscribe();
					}
				});
			})();
		}

		return unsub;
	});
}

function providerFor(name: string) {
	switch (name) {
		case 'google':
			return new GoogleAuthProvider();
		default:
			throw 'unknown provider ' + name;
	}
}

// async function getOnboardingState = () => {
// 	getDoc(doc(db, `users/${}`))
// }

export async function signInWith(name: string) {
	const auth = getAuth(app);
	const provider = providerFor(name);

	singInLoading.set(true);

	signInWithPopup(auth, provider).then((res) => {
		singInLoading.set(false);

		console.log(res);
	});
}

export async function signOut() {
	const auth = getAuth(app);
	await _signOut(auth);
}

export async function deleteDocument(document: Document) {
	if (!document._collection) throw Error('Objects that extends Document must specify __collection');

	await deleteDoc(doc(db, document._collection, document._id));
}

export function getCollectionStore<T extends Document>(
	type: { new (data: AnyObject): T },
	collectionPath: string,
	uid: string,
	initialData: Array<T> = []
) {
	return readable<Array<T>>(initialData, (set) => {
		let dbUnsubscribe: () => void;
		let unsubbed = false;
		const unsub = () => {
			unsubbed = true;
			if (dbUnsubscribe) {
				dbUnsubscribe();
			}
		};
		if (browser) {
			(async () => {
				if (unsubbed) return;
				const q = query(collection(db, collectionPath), where('uid', '==', uid));
				dbUnsubscribe = onSnapshot(q, (docs) => {
					const newDocuments: Array<T> = [];
					docs.forEach((doc) => {
						const newDoc = new type(doc.data());
						newDoc._id = doc.id;
						newDocuments.push(newDoc);
					});
					set(newDocuments);
				});
			})();
		}

		return unsub;
	});
}
