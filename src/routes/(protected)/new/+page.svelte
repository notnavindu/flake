<script lang="ts">
	import { goto } from '$app/navigation';
	import { uploadMedia } from '$lib/client/api';
	import RoundedButton from '$lib/components/Common/RoundedButton.svelte';
	import GrantPermissions from '$lib/components/Microphone/GrantPermissions.svelte';
	import MicrophoneDisable from '$lib/components/Microphone/MicrophoneDisable.svelte';
	import MicrophoneSelect from '$lib/components/Microphone/MicrophoneSelect.svelte';
	import Icon from '@iconify/svelte';
	import { onMount } from 'svelte';
	import { tweened } from 'svelte/motion';
	import { fade, fly } from 'svelte/transition';

	let state: 'initial' | 'recording' | 'recorded' | 'complete' = 'initial';

	let microphones: { label: string; id: string }[] = [];
	let selectedMicrophoneId: 'disabled' | string;

	let video: HTMLVideoElement;
	// let output: HTMLVideoElement;

	let recorder: MediaRecorder;
	let audioRecorder: MediaRecorder;

	let data: Blob[] = [];
	let audioData: Blob[] = [];

	// outputs
	let recordedVideoBlob: Blob;
	let recordedVideoUrl: string;

	let micPermissions = false;
	let mounted = false;
	let uploadProgress = tweened(0);

	const startCapture = async () => {
		let captureStream: MediaStream;
		state = 'recording';

		try {
			captureStream = await navigator.mediaDevices.getDisplayMedia();
			video.srcObject = captureStream;

			let audio: MediaStream | undefined;
			let combinedStream: MediaStream;

			if (selectedMicrophoneId !== 'disabled') {
				audio = await navigator.mediaDevices.getUserMedia({
					audio: {
						echoCancellation: true,
						noiseSuppression: false,
						deviceId: selectedMicrophoneId
					},
					video: false
				});

				combinedStream = new MediaStream([
					...captureStream.getVideoTracks(),
					...audio.getAudioTracks()
				]);
			} else {
				combinedStream = new MediaStream([...captureStream.getVideoTracks()]);
			}

			recorder = new MediaRecorder(combinedStream);

			recorder.ondataavailable = (e) => {
				data.push(e.data);
			};

			recorder.onstop = () => {
				captureStream.getTracks().forEach((track) => track.stop());

				recordedVideoBlob = new Blob(data, { type: 'video/mp4' });
				recordedVideoUrl = URL.createObjectURL(recordedVideoBlob);
			};

			recorder.start();

			if (selectedMicrophoneId !== 'disabled' && audio) {
				audioRecorder = new MediaRecorder(audio);

				audioRecorder.ondataavailable = (e) => audioData.push(e.data);

				audioRecorder.onstop = () => {
					audio!.getTracks().forEach((track) => track.stop());

					let blobData = new Blob(audioData, { type: 'audio/wav' });
					// to deepgram
				};

				audioRecorder.start();
			}
		} catch (err) {
			state = 'initial';

			console.log(`Error: ${err}`);
		}
	};

	const stopCapture = () => {
		if (recorder) recorder.stop();
		if (audioRecorder) audioRecorder.stop();

		state = 'recorded';
	};

	const cancelCapture = () => {
		if (recorder) recorder.stop();
		if (audioRecorder) audioRecorder.stop();

		data = [];
		audioData = [];
		state = 'initial';
	};

	const uploadFile = async () => {
		console.log(recordedVideoBlob.size);
		const id = await uploadMedia(recordedVideoBlob, uploadProgress);

		uploadProgress.set(100);
		goto(`/${id}`);
	};

	onMount(() => {
		mounted = true;

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

				selectedMicrophoneId = microphones[0].id;
				console.log(microphones);
			})
			.catch(() => {
				console.log('Error listing devices');
			});
	});
</script>

<section class="w-full max-w-3xl h-full m-auto flex flex-col justify-center">
	<div class="text-4xl mb-4">New Flake</div>

	<div class="mb-4">
		{#if state === 'initial'}
			<div
				class="w-full rounded-xl aspect-video grid place-items-center bg-black bg-opacity-5 relative overflow-hidden border-2 border-white border-opacity-40"
			>
				<div class="z-10 w-full h-full p-8 flex flex-col">
					<div class="mb-2">Select Microphone</div>
					<div class="flex flex-wrap gap-1 w-full">
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

					{#if mounted}
						<div class="mt-auto ml-auto" in:fly={{ y: 30, delay: 100 }}>
							<RoundedButton on:click={startCapture} blackWhite>
								<div class="w-full h-full flex gap-2 items-center">
									<Icon
										class="text-2xl text-red-600 transition-all group-hover:rotate-180 duration-700"
										icon="la:snowflake"
									/>
									<div>Start Recording</div>
								</div>
							</RoundedButton>
						</div>
					{/if}
				</div>

				<!-- TODO: Store locally -->

				<img
					alt="static"
					class="absolute w-full h-full blur-xl opacity-20 transform-gpu"
					src="https://i.pinimg.com/originals/bb/cb/17/bbcb17db81a9720520f4bd4d3271022f.gif"
				/>
			</div>
		{:else if state === 'recording'}
			<div class="w-full aspect-video border rounded-lg relative">
				<div
					class="top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 absolute z-20 flex items-center justify-center flex-col gap-3"
				>
					<RoundedButton class="text-xl px-8" blueWhite on:click={stopCapture}>
						Finish Recording
					</RoundedButton>
					<RoundedButton class="text-base px-8" lightRed on:click={cancelCapture}>
						Cancel
					</RoundedButton>
				</div>

				<!-- svelte-ignore a11y-media-has-caption -->
				<video class="z-0 relative opacity-60" bind:this={video} autoplay playsinline />
			</div>
		{:else if state == 'recorded'}
			<div class="w-full rounded-xl aspect-video border-2 border-white border-opacity-50 relative">
				{#if $uploadProgress > 0}
					<div class="absolute w-full h-full z-10 flex items-center justify-center">
						<div
							class="w-[200px] h-[200px] bg-black bg-opacity-5 rounded-2xl backdrop-blur-xl
								flex items-center justify-center"
						>
							<span class="text-7xl">{$uploadProgress.toFixed(0)}</span>
							<sup class="mb-4 text-xl">%</sup>
						</div>
					</div>
				{/if}

				<!-- svelte-ignore a11y-media-has-caption -->
				<video class="w-full relative z-0" src={recordedVideoUrl} autoplay playsinline controls />
			</div>

			<div class="w-full flex items-center justify-center mt-6 gap-3">
				<RoundedButton class="text-xl px-8" on:click={uploadFile} blueWhite>
					<Icon icon="mdi:tick" />
					Publish
				</RoundedButton>

				<RoundedButton class="text-xl px-8" lightRed>
					<Icon icon="mdi:bin-outline" />
					Discard
				</RoundedButton>
			</div>
		{/if}
	</div>
</section>
