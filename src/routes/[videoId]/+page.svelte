<script>
	/** @type {import('./$types').PageData} */
	export let data;
</script>

<div class="w-full h-full max-w-3xl m-auto flex items-center justify-center">
	<!-- svelte-ignore a11y-media-has-caption -->
	<video class="w-full" src={data.data.downloadUrl} controls />
</div>
