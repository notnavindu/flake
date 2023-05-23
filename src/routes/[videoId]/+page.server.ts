import { initializeHostFirebase } from '$lib/server/firebase';
import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types.js';

export const load: PageServerLoad = async ({ params, cookies }) => {
	const hostAdmin = initializeHostFirebase();

	let doc = (await hostAdmin.firestore.collection('flakes').doc(params.videoId).get()).data();

	if (!doc) throw error(404, 'Invalid Video Id');

	return {
		data: {
			id: doc.id,
			downloadUrl: doc.downloadUrl,
			name: doc.name,
			uploadedBy: doc.uploadedBy,
			uploadedByName: doc.uploadedByName
		}
	};
};
