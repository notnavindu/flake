<script lang="ts">
	let video: HTMLVideoElement;
	let output: HTMLVideoElement;
	let audioContainer: HTMLAudioElement;

	let recorder: MediaRecorder;
	let audioRecorder: MediaRecorder;

	let data: Blob[] = [];
	let audioData: Blob[] = [];

	async function startCapture() {
		let captureStream: MediaStream;

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
				console.log(url);
				audioContainer.src = url;
			};

			recorder.start();
			audioRecorder.start();
		} catch (err) {
			console.error(`Error: ${err}`);
		}
	}
</script>

<main class="p-8">
	<button on:click={startCapture}>Start recording</button>
	<button
		on:click={() => {
			recorder.stop();
			audioRecorder.stop();
		}}>two</button
	>

	<!-- svelte-ignore a11y-media-has-caption -->
	<div class="w-96 border">
		<video bind:this={video} autoplay playsinline />
	</div>

	Output
	<!-- svelte-ignore a11y-media-has-caption -->
	<video bind:this={output} autoplay playsinline controls />
	<!-- <video bind:this={video} /> -->

	audio
	<audio bind:this={audioContainer} controls autoplay />
</main>
