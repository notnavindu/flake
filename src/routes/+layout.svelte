<script lang="ts">
	import Auth from '$lib/components/auth/Auth.svelte';
	import './styles.css';
	import { browser } from '$app/environment';
	import { initializeFirebase } from '$lib/client/firebase';
	import {
		PUBLIC_API_KEY,
		PUBLIC_APP_ID,
		PUBLIC_AUTH_DOMAIN,
		PUBLIC_MESSAGE_SENDER_ID,
		PUBLIC_PROJECT_ID,
		PUBLIC_STORAGE_BUCKET
	} from '$env/static/public';
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
			initializeFirebase({
				apiKey: PUBLIC_API_KEY,
				appId: PUBLIC_APP_ID,
				authDomain: PUBLIC_AUTH_DOMAIN,
				messagingSenderId: PUBLIC_MESSAGE_SENDER_ID,
				projectId: PUBLIC_PROJECT_ID,
				storageBucket: PUBLIC_STORAGE_BUCKET
			});
		} catch (ex) {
			console.error(ex);
		}
	}
</script>

<div class="h-screen">
	<header class="w-full fixed top-0 left-0 flex items-center justify-between p-5">
		<div class=" text-3xl leading-none gap-2 group select-none cursor-pointer">
			<a href="/" class="flex items-center justify-center gap-2">
				<Icon
					class="text-blue-400 transition-all group-hover:rotate-180 duration-700"
					icon="la:snowflake"
				/> Flake
			</a>
		</div>

		<div class="flex gap-2">
			<Auth />
		</div>
	</header>

	<main class="h-screen p-4">
		<slot />
	</main>
</div>

<style>
</style>
