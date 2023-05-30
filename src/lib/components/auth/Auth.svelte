<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import { signInWith, signOut } from '$lib/client/firebase';
	import RoundedButton from '$lib/components/Common/RoundedButton.svelte';
	import { singInLoading } from '$lib/stores/loaders.store';
	import Icon from '@iconify/svelte';
	import { fly } from 'svelte/transition';
</script>

{#if $page.data.userSession}
	<RoundedButton on:click={() => goto('/new')} blueWhite>+ New</RoundedButton>

	<div in:fly={{ x: 50 }}>
		<RoundedButton on:click={() => goto('/profile')} blackWhite>
			{#if $singInLoading}
				<!-- TODO: Use button's loading prop -->
				<Icon class="animate-spin" icon="mingcute:loading-line" />
				Loading
			{:else}
				<Icon icon="mdi:user" />
				{$page.data.userSession.name.split(' ')[0]}
			{/if}
		</RoundedButton>
	</div>
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
