<script lang="ts">
	import { slide } from 'svelte/transition';

	export let title: string;
	export let idx: number;
	export let step: number;
</script>

<button on:click={() => (step = idx)} class="w-full p-5 text-xl flex bg-zinc-900 gap-3">
	<div class="bg-blue-600 w-8 h-8 grid place-items-center rounded-full">{idx}</div>
	<div>{title}</div>
</button>

{#if step === idx}
	<div class="px-8 py-5" transition:slide>
		<slot />
	</div>
{/if}
