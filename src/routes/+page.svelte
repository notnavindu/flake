<script>
	import RoundedButton from '$lib/components/Common/RoundedButton.svelte';
	import Icon from '@iconify/svelte';
	import { onMount } from 'svelte';
	import { slide } from 'svelte/transition';

	let mounted = false;

	onMount(() => {
		mounted = true;
	});
</script>

<svelte:head>
	<title>Home</title>
	<meta name="description" content="" />
</svelte:head>

<section class="w-full h-screen flex flex-col items-center justify-center">
	<div class="flex items-center gap-2 text-5xl mb-8 group">
		<div>
			<Icon
				class="text-blue-400 transition-all group-hover:rotate-180 duration-700"
				icon="la:snowflake"
			/>
		</div>

		<div>Flake</div>
	</div>

	<div
		class="w-full max-w-4xl aspect-video border-2 flex flex-col items-center justify-center rounded-2xl text-center"
	>
		<h1 class="text-3xl sm:text-6xl">
			The self-hostable <br /> loom clone <br />no one asked for.
		</h1>

		<h2 class="mt-6 opacity-60 text-xl">Asynchronously Synchronize.</h2>

		<RoundedButton blueWhite class="mt-4 flex items-center">
			Get Started
			<Icon class="text-xs" icon="gis:arrow-o" />
		</RoundedButton>
	</div>
</section>

<section class="w-full h-screen flex flex-col items-center justify-center border">
	Connect your firebase for storage
</section>

<section class="w-full h-screen flex flex-col items-center justify-center border">
	Deepgram for transcription
</section>

<section class="w-full h-screen flex flex-col items-center justify-center border">
	GPT for summarization (coming soon)
</section>

<style>
</style>
