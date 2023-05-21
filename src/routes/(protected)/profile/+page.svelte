<script>
	import { signOut } from '$lib/client/firebase';

	import Icon from '@iconify/svelte';

	export let data;

	console.log(data);
</script>

<div class="flex justify-between mt-20 items-center">
	<div class="text-3xl">Hello, {data.userSession.name.split(' ')[0]}!</div>

	<button on:click={signOut}>
		<Icon class="text-3xl" icon="uil:signout" />
	</button>
</div>

<div class="text-xl mt-8 opacity-75">Your Videos</div>

{#each data.videos as vid}
	{vid.name}
{/each}
