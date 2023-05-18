<script lang="ts">
	import GrantPermissions from '$lib/components/Microphone/GrantPermissions.svelte';
	import MicrophoneDisable from '$lib/components/Microphone/MicrophoneDisable.svelte';
	import MicrophoneSelect from '$lib/components/Microphone/MicrophoneSelect.svelte';
	import { onMount } from 'svelte';
	import { fade } from 'svelte/transition';

	let state: 'initial' | 'recording' | 'uploading' | 'complete' = 'initial';

	let microphones: { label: string; id: string }[] = [];
	let selectedMicrophoneId: string;

	let video: HTMLVideoElement;
	let output: HTMLVideoElement;
	let audioContainer: HTMLAudioElement;

	let recorder: MediaRecorder;
	let audioRecorder: MediaRecorder;

	let data: Blob[] = [];
	let audioData: Blob[] = [];

	let micPermissions = false;

	const startCapture = async () => {
		let captureStream: MediaStream;
		state = 'recording';

		try {
			captureStream = await navigator.mediaDevices.getDisplayMedia();
			video.srcObject = captureStream;

			let audio = await navigator.mediaDevices.getUserMedia({
				audio: true,
				video: false
			});

			let combinedStream = new MediaStream([
				...captureStream.getVideoTracks(),
				...audio.getAudioTracks()
			]);

			recorder = new MediaRecorder(combinedStream);
			audioRecorder = new MediaRecorder(audio);

			recorder.ondataavailable = (e) => {
				data.push(e.data);
			};

			audioRecorder.ondataavailable = (e) => {
				audioData.push(e.data);
			};

			recorder.onstop = () => {
				captureStream.getTracks().forEach((track) => track.stop());
				let blobData = new Blob(data, { type: 'video/mp4' });
				let url = URL.createObjectURL(blobData);
				output.src = url;
			};

			audioRecorder.onstop = () => {
				audio.getTracks().forEach((track) => track.stop());

				let blobData = new Blob(audioData, { type: 'audio/wav' });
				let url = URL.createObjectURL(blobData);
				audioContainer.src = url;
			};

			recorder.start();
			audioRecorder.start();
		} catch (err) {
			state = 'initial';

			console.log(`Error: ${err}`);
		}
	};

	const stopCapture = () => {
		if (recorder) recorder.stop();
		if (audioRecorder) audioRecorder.stop();

		state = 'uploading';
	};

	onMount(() => {
		navigator.mediaDevices
			.getUserMedia({ audio: true, video: false })
			.then(() => (micPermissions = true));

		navigator.mediaDevices
			.enumerateDevices()
			.then((devices) => {
				devices.forEach((device) => {
					if (device.kind === 'audioinput' && device.deviceId.length > 0) {
						microphones = [...microphones, { label: device.label, id: device.deviceId }];
					}
				});

				selectedMicrophoneId = 'disabled';
			})
			.catch(() => {
				console.log('Error listing devices');
			});

		console.log(microphones);
	});
</script>

<!-- <main class="p-8">
	<button on:click={startCapture}>Start recording</button>
	<button
		on:click={() => {
			recorder.stop();
			audioRecorder.stop();
		}}>two</button
	>

	<div class="w-96 border">
		<video bind:this={video} autoplay playsinline />
	</div>

	Output
	<video bind:this={output} autoplay playsinline controls />

	audio
	<audio bind:this={audioContainer} controls autoplay />
</main> -->

<section class="w-full max-w-3xl m-auto pt-16 px-6">
	<!-- <div class="text-4xl font-bold mb-4">New thing ❆</div> -->

	<div class="mb-4">
		{#if state === 'initial'}
			<div
				class="w-full group rounded-xl aspect-video grid place-items-center bg-black bg-opacity-5 relative overflow-hidden"
			>
				<div class="z-10 w-full h-full p-5 group">
					Select Microphone
					<div class="flex flex-wrap gap-1">
						<div in:fade={{ delay: 0 }}>
							<MicrophoneDisable
								id={'disabled'}
								selectedId={selectedMicrophoneId}
								on:click={() => (selectedMicrophoneId = 'disabled')}
							/>

							{#if !micPermissions}
								<GrantPermissions />
							{/if}
						</div>

						{#if microphones.length > 0}
							{#each microphones as mic, i}
								<div in:fade={{ delay: 200 * (i + 1) }}>
									<MicrophoneSelect
										label={mic.label}
										id={mic.id}
										selectedId={selectedMicrophoneId}
										on:click={() => (selectedMicrophoneId = mic.id)}
									/>
								</div>
							{/each}
						{/if}
					</div>

					<button class="bg-red-500 p-2" on:click={startCapture}>Start recording</button>
				</div>

				<!-- TODO: Store locally -->
				<img
					alt="static"
					class="absolute w-full h-full blur-xl opacity-20 transform-gpu group-hover:opacity-5 transition-all duration-500"
					src="https://i.pinimg.com/originals/bb/cb/17/bbcb17db81a9720520f4bd4d3271022f.gif"
				/>
			</div>
		{:else if state === 'recording'}
			<div class="w-full aspect-video border">
				<!-- svelte-ignore a11y-media-has-caption -->
				<video bind:this={video} autoplay playsinline />
			</div>
		{:else if state == 'complete'}
			<div
				class="w-full rounded-xl aspect-video grid place-items-center text-6xl bg-black bg-opacity-5"
			>
				❆ Done
			</div>
		{/if}
	</div>

	<!-- Audio on or off, Transcribe on off, Summarize on off -->

	<br />
	<button class="bg-black text-white p-2" on:click={stopCapture}> Stop </button>

	Output
	<video bind:this={output} autoplay playsinline controls />

	audio
	<audio bind:this={audioContainer} controls autoplay />
</section>
