<script lang="ts">
	export let blueWhite = false;
	export let blackWhite = false;
	export let lightRed = false;

	// TODO: @Nav figure out variants (CVA?)
</script>

<button
	on:click
	class:blueWhite
	class:blackWhite
	class:lightRed
	class="w-fit py-2 px-3 rounded-full text-sm relative overflow-hidden bg-white flex items-center gap-2
        hover:scale-105 transition-all duration-100 font-bold group {$$props.class}"
>
	<slot />
</button>

<style lang="postcss">
	.blackWhite {
		@apply bg-white text-black;
	}

	.blueWhite {
		@apply bg-blue-500 text-white;
	}

	.lightRed {
		@apply bg-red-100 text-red-500;
	}
</style>
