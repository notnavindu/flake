<script lang="ts">
	import Header from './Header.svelte';
	import Auth from '$lib/components/auth/Auth.svelte';
	import './styles.css';
	import { browser } from '$app/environment';
	import { initializeFirebase } from '$lib/client/firebase';
	import { PUBLIC_FIREBASE_CLIENT_CONFIG } from '$env/static/public';

	if (browser) {
		try {
			initializeFirebase(JSON.parse(PUBLIC_FIREBASE_CLIENT_CONFIG));
		} catch (ex) {
			console.error(ex);
		}
	}
</script>

<div class="">
	<header>
		<Auth />
	</header>

	<main>
		<slot />
	</main>
</div>

<style>
</style>
