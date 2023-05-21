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
	<button
		in:fly={{ x: 50, delay: 200 }}
		on:click={() => goto('/new')}
		class="w-8 h-8 bg-blue-500 rounded-full leading-none text-xl"
	>
		+
	</button>

	<div in:fly={{ x: 50 }}>
		<RoundedButton on:click={() => signOut()} blackWhite>
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
