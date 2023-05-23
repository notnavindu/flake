<script lang="ts">
	import { updateVideoTitle } from '$lib/client/api';
	import type { KeyboardEventHandler } from 'svelte/elements';
	import { slide } from 'svelte/transition';

	export let data: import('./$types').PageData;

	let isOwner = data.data.uploadedBy === data?.userSession?.uid;
	let isFocused = isOwner;
	let value = data.data.name;

	const handleKeyDown: KeyboardEventHandler<HTMLInputElement> = async (e) => {
		if ((e.ctrlKey && e.key == 'Enter') || (e.metaKey && e.key == 'Enter')) {
			updateVideoTitle(data.data.id, value);
		}
	};
</script>

<div class="w-full h-full max-w-3xl m-auto flex items-center justify-center">
	<div class="flex flex-col">
		<!-- svelte-ignore a11y-autofocus -->
		<input
			class="text-xl bg-transparent p-2 mb-2 focus:outline-none border-2 border-transparent rounded-lg focus:border-blue-500"
			bind:value
			disabled={!isOwner}
			on:focus={() => isOwner && (isFocused = true)}
			on:blur={() => isOwner && (isFocused = false)}
			on:keydown={handleKeyDown}
			autofocus={isOwner}
		/>

		{#if isFocused}
			<div class="flex text-xs mb-4 opacity-50 pl-2" transition:slide>
				<span>⌘ + Enter to save</span>
			</div>
		{/if}

		<!-- svelte-ignore a11y-media-has-caption -->
		<video class="w-full border rounded-xl" src={data.data.downloadUrl} controls />

		<div class="mt-3 opacity-80">By {data.data.uploadedByName}</div>
	</div>
</div>
