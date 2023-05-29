<script lang="ts">
	import { deleteVideo } from '$lib/client/api.js';
	import { signOut } from '$lib/client/firebase';

	import Icon from '@iconify/svelte';
	import dayjs from 'dayjs';
	import relativeTime from 'dayjs/plugin/relativeTime';
	import { flip } from 'svelte/animate';

	dayjs.extend(relativeTime);

	export let data;

	let loading = false;

	const handleDeleteClick = async (id: string) => {
		loading = true;

		await deleteVideo(id);
		data.videos = data.videos.filter((vid) => vid.id != id);

		loading = false;
	};
</script>

<svelte:head>
	<title>Profile | Flake</title>
</svelte:head>

<div class="w-full max-w-3xl h-full m-auto">
	<div class="flex justify-between mt-20 items-center">
		<div class="text-3xl">Hello, {data.userSession.name.split(' ')[0]}!</div>

		<button on:click={signOut}>
			<Icon class="text-3xl" icon="uil:signout" />
		</button>
	</div>

	<div class="text-xl mt-8 opacity-75">Your Videos</div>

	<div class="flex flex-col flex-wrap gap-2 mt-2" class:opacity-75={loading}>
		{#each data.videos as vid (vid.id)}
			<div class="p-3 bg-zinc-800 flex flex-col rounded-md" animate:flip>
				<div class="flex justify-between">
					<div>
						<a href={`/${vid.id}`}>{vid.name}</a>
						<div class="text-xs opacity-50">{(vid.fileSize / 1024 / 1024).toFixed(2)} MB</div>
					</div>

					<div class="flex flex-col items-end">
						<div class="text-xs opacity-50">{dayjs(vid.createdAt).fromNow()}</div>
						<button
							disabled={loading}
							on:click={() => handleDeleteClick(vid.id)}
							class="text-sm mt-2"
						>
							<Icon icon="ic:outline-delete" />
						</button>
					</div>
				</div>
			</div>
		{/each}
	</div>
</div>
