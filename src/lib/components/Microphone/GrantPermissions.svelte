<script lang="ts">
	import Icon from '@iconify/svelte';

	export let micPermissions = false;
</script>

<button
	on:click={() =>
		navigator.mediaDevices
			.getUserMedia({ audio: true, video: false })
			.then(() => (micPermissions = true))}
	class="w-fit py-2 px-3 rounded-full text-sm overflow-hidden bg-white text-black"
>
	<div class="w-full h-full flex items-center justify-center gap-2">
		<Icon icon="dashicons:unlock" />
		Grant Permissions
	</div>
</button>
