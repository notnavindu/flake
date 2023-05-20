<script lang="ts">
	export let blueWhite = false;
	export let blackWhite = false;
	export let lightRed = false;
	export let greenBlack = false;

	// TODO: @Nav figure out variants (CVA?)
</script>

<button
	on:click
	class:blueWhite
	class:blackWhite
	class:lightRed
	class:greenBlack
	class="w-fit py-2 px-4 rounded-full text-sm relative overflow-hidden bg-white flex items-center gap-2
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

	.greenBlack {
		@apply bg-green-200 text-black;
	}
</style>
