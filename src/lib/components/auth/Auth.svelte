<script lang="ts">
	import { page } from '$app/stores';
	import { signInWith, signOut } from '$lib/client/firebase';
</script>

{#if $page.data.userSession}
	<button class="bg-blue-600 p-2 text-white" on:click={() => signOut()}>Sign Out</button>
	{$page.data.userSession.name} ({$page.data.userSession.email})
{:else}
	<button class="bg-blue-600 p-2 text-white" on:click={() => signInWith('google')}>
		Sign In with Google
	</button>
	(visitor)
{/if}
