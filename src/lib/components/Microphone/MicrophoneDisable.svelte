<script lang="ts">
	import { tweened } from 'svelte/motion';
	import { expoOut } from 'svelte/easing';
	import Icon from '@iconify/svelte';

	export let id: string;
	export let selectedId: string;

	const animation = tweened(0, { duration: 600, easing: expoOut });

	$: {
		selectedId;

		if (selectedId === id) {
			animation.set(100);
		} else {
			animation.set(0);
		}
	}
</script>

<button
	on:click
	class="w-fit py-2 px-6 rounded-full text-sm relative overflow-hidden bg-white"
	class:deselected={selectedId !== id}
	class:selected={selectedId === id}
>
	<div class="z-10 relative flex items-center gap-2">
		<Icon class="text-lg" icon="fluent:mic-off-24-filled" />

		Keep it off
	</div>
	<div
		class="h-full absolute z-0 bg-red-700 inset-0 rounded-full opacity-90"
		style:width="{$animation}%"
	/>
</button>

<style lang="postcss">
	.selected {
		@apply text-white transition-all duration-500;
	}

	.deselected {
		@apply text-black transition-all duration-500;
	}
</style>
