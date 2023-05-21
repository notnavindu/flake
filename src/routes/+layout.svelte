<script lang="ts">
	import Header from './Header.svelte';
	import Auth from '$lib/components/auth/Auth.svelte';
	import './styles.css';
	import { browser } from '$app/environment';
	import { initializeFirebase } from '$lib/client/firebase';
	import { PUBLIC_FIREBASE_CLIENT_CONFIG } from '$env/static/public';
	import Icon from '@iconify/svelte';

	import '@fontsource/figtree/300.css';
	import '@fontsource/figtree/400.css';
	import '@fontsource/figtree/500.css';
	import '@fontsource/figtree/600.css';
	import '@fontsource/figtree/700.css';
	import '@fontsource/figtree/800.css';
	import '@fontsource/figtree/900.css';

	if (browser) {
		try {
			initializeFirebase(JSON.parse(PUBLIC_FIREBASE_CLIENT_CONFIG));
		} catch (ex) {
			console.error(ex);
		}
	}
</script>

<div class="h-screen">
	<header class="w-full fixed top-0 left-0 flex items-center justify-between p-5">
		<div
			class="flex items-center justify-center text-3xl leading-none gap-2 group select-none cursor-pointer"
		>
			<Icon
				class="text-blue-400 transition-all group-hover:rotate-180 duration-700"
				icon="la:snowflake"
			/> Flake
		</div>

		<div class="flex gap-2">
			<Auth />
		</div>
	</header>

	<main class="h-screen p-4 w-full max-w-3xl h-full m-auto">
		<slot />
	</main>
</div>

<style>
</style>
