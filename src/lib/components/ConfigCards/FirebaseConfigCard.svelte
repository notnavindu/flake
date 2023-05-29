<script lang="ts">
	import Icon from '@iconify/svelte';

	export let projectId: string;
</script>

<div class="w-full h-36 border-2 rounded-md border-orange-400 p-4 flex flex-col relative">
	<Icon class="text-xl absolute right-3 top-3 text-orange-400" icon="mdi:tick-circle" />

	<div class="text-orange-400 text-xs uppercase">Firebase</div>

	<div class="text-lg mt-auto">
		Connected Project <br />
		<span class="bg-zinc-800 px-2 rounded-md py-px">
			{projectId}
		</span>
	</div>
</div>
