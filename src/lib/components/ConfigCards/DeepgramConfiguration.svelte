<script lang="ts">
	import { updateDeepgramKey } from '$lib/client/api';
	import Icon from '@iconify/svelte';

	export let deepgramState: boolean;

	let secret: string;

	// TODO: Allow API KEY editing

	const handleSaveClick = async () => {
		if (secret.length > 0) updateDeepgramKey(secret);
	};
</script>

<div
	class="w-full relative h-36 border-2 rounded-md border-red-400 p-4 flex flex-col"
	title="Needs setting up"
>
	{#if deepgramState}
		<Icon class="text-xl absolute right-3 top-3 text-red-400" icon="mdi:tick-circle" />
	{:else}
		<Icon class="text-xl absolute right-3 top-3 text-red-400" icon="ic:round-warning" />
	{/if}

	<div class="text-red-400 text-xs uppercase flex items-center justify-between">
		Deepgram Configuration
	</div>

	{#if deepgramState}
		<div class="text-lg mt-auto">Deepgram API key saved</div>
	{:else}
		<div class="mt-auto">
			<div class="mb-1 opacity-75 text-sm">Enter your deepgram API secret</div>

			<div class="flex gap-3">
				<input
					bind:value={secret}
					placeholder="f706855b2...."
					class="w-[85%] px-2 py-2 flex items-center bg-zinc-800 text-white rounded-lg focus:outline-0 text-xs flex-shrink-0"
				/>

				<button
					on:click={handleSaveClick}
					class="flex-grow w-full flex items-center justify-center"
				>
					<Icon class="text-xl text-white " icon="material-symbols:save" />
				</button>
			</div>
		</div>
	{/if}
</div>
