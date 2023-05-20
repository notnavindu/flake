<script lang="ts">
	import { page } from '$app/stores';
	import { signInWith, signOut } from '$lib/client/firebase';
	import RoundedButton from '$lib/components/Common/RoundedButton.svelte';
	import { singInLoading } from '$lib/stores/loaders.store';
	import Icon from '@iconify/svelte';
</script>

{#if $page.data.userSession}
	<RoundedButton on:click={() => signOut()} blackWhite>
		{#if $singInLoading}
			<Icon class="animate-spin" icon="mingcute:loading-line" />
			Loading
		{:else}
			<Icon icon="mdi:user" />
			{$page.data.userSession.name.split(' ')[0]}
		{/if}
	</RoundedButton>
{:else}
	<RoundedButton on:click={() => signInWith('google')} blueWhite>
		{#if $singInLoading}
			<Icon class="animate-spin" icon="mingcute:loading-line" />
			Loading
		{:else}
			<Icon icon="bx:log-in" />
			Sign in
		{/if}
	</RoundedButton>
{/if}
