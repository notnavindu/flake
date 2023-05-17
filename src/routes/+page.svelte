<script lang="ts">
	import Counter from './Counter.svelte';
	import type { PageData } from './$types';
	export let data: PageData;
</script>

<svelte:head>
	<title>Home</title>
	<meta name="description" content="Svelte demo app" />
</svelte:head>

<section>
	<div>Main</div>

	{#if data.userCountData}
		<Counter userCountData={data.userCountData} />
	{/if}
</section>

<style>
</style>
