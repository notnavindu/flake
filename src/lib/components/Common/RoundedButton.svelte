<script lang="ts">
	export let white = true;
	export let blackRed = false;
	export let blueWhite = false;
</script>

<button
	on:click
	class:white
	class:blackRed
	class:blueWhite
	class="w-fit py-2 px-3 rounded-full text-sm relative overflow-hidden bg-white flex items-center gap-2
        hover:scale-105 transition-all duration-100 font-bold"
>
	<slot />
</button>

<style lang="postcss">
	.white {
		@apply bg-white;
	}

	.blackRed {
		@apply bg-black text-red-500;
	}

	.blueWhite {
		@apply bg-blue-500 text-white;
	}
</style>
