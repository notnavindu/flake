<script lang="ts">
	import { page } from '$app/stores';
	import { signInWith, signOut } from '$lib/client/firebase';
	import RoundedButton from '$lib/components/Common/RoundedButton.svelte';
	import Icon from '@iconify/svelte';
</script>

{#if $page.data.userSession}
	<RoundedButton on:click={() => signOut()} blackWhite>
		<Icon icon="mdi:user" />
		{$page.data.userSession.name.split(' ')[0]}
	</RoundedButton>
{:else}
	<RoundedButton on:click={() => signInWith('google')} blueWhite>
		<Icon icon="bx:log-in" />
		Sign in
	</RoundedButton>
{/if}
