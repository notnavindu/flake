import { redirect } from '@sveltejs/kit';

/** @type {import('./$types').LayoutServerLoad} */
export async function load({ parent, url }) {
	const { userSession } = await parent();

	console.log(userSession);

	if (!userSession) throw redirect(307, '/login');

	// if (!url.pathname.startsWith('/onboarding') && !userSession?.setupComplete)
	// 	throw redirect(307, '/onboarding');

	// if (url.pathname.startsWith('/onboarding') && userSession.setupComplete)
	// 	throw redirect(307, '/profile');
}
