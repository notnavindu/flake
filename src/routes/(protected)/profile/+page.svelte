<script>
	import { signOut } from '$lib/client/firebase';

	import Icon from '@iconify/svelte';
	import dayjs from 'dayjs';
	import relativeTime from 'dayjs/plugin/relativeTime';

	dayjs.extend(relativeTime);

	export let data;
</script>

<div class="w-full max-w-3xl h-full m-auto">
	<div class="flex justify-between mt-20 items-center">
		<div class="text-3xl">Hello, {data.userSession.name.split(' ')[0]}!</div>

		<button on:click={signOut}>
			<Icon class="text-3xl" icon="uil:signout" />
		</button>
	</div>

	<div class="text-xl mt-8 opacity-75">Your Videos</div>

	<div class="flex flex-col flex-wrap gap-2 mt-2">
		{#each data.videos as vid}
			<a href={`/${vid.id}`}>
				<div class="p-3 bg-zinc-800 flex flex-col">
					<div class="flex justify-between">
						{vid.name} <span class="text-xs opacity-50">{dayjs(vid.createdAt).fromNow()}</span>
					</div>
					<div class="text-xs opacity-50">{(vid.fileSize / 1024 / 1024).toFixed(2)} MB</div>
				</div>
			</a>
		{/each}
	</div>
</div>
