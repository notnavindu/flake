<script lang="ts">
	import { goto } from '$app/navigation';
	import { validateAndSaveServiceAccount } from '$lib/client/api';
	import { refreshIdToken } from '$lib/client/firebase';
	import RoundedButton from '$lib/components/Common/RoundedButton.svelte';
	import OnboardingStep from '$lib/components/onboarding/OnboardingStep.svelte';
	import { serviceAccountKeys } from '$lib/constants/validator.const';
	import Icon from '@iconify/svelte';

	let step = 0;
	let validatingServiceAccount = false;

	const createFilePicker = () => {
		let input = document.createElement('input');
		input.type = 'file';
		input.multiple = false;
		input.accept = '.json';

		input.onchange = (e) => {
			const target = e.target as HTMLInputElement;
			const file = target?.files?.[0];
			let serviceAccount: { [k: string]: any };

			if (file) {
				var reader = new FileReader();

				reader.readAsText(file, 'UTF-8');

				reader.onload = async function (evt) {
					try {
						validatingServiceAccount = true;
						serviceAccount = JSON.parse(evt?.target?.result as string);

						const isValid = serviceAccountKeys.every((key) => serviceAccount[key]?.length > 0);

						if (!isValid) {
							validatingServiceAccount = true;
							return alert('Invalid JSON');
						}
					} catch (error) {
						console.log(error);
						alert('error parsing json');
					}

					const { success } = await validateAndSaveServiceAccount(serviceAccount);

					if (success) {
						await refreshIdToken();
						goto('/new');
					} else {
						alert('Service account validation failed');
					}
					validatingServiceAccount = false;
				};
				reader.onerror = function (evt) {
					alert('Error reading file');
				};
			}
		};

		input.click();
	};
</script>

<svelte:head>
	<title>Onboarding | Flake</title>
</svelte:head>

<div class="w-full h-full grid grid-rows-2 md:grid-cols-2">
	<div class="flex items-center justify-center h-full md:h-screen">
		<Icon
			width={364}
			class="text-blue-400 transform transition-all duration-700"
			style="transform: rotate({step * 60}deg) scale({0.8 + 0.1 * step}); 
					opacity: {20 + 17.5 * step}%;"
			icon="la:snowflake"
		/>
	</div>

	<div class="p-5 h-screen overflow-auto">
		<div class="text-3xl mb-8 mt-0 md:mt-24">Let's get you up to <br />speed with Flake</div>

		<OnboardingStep bind:step idx={0} title="Create a Firebase Project">
			Go to your <a
				class="text-blue-500 underline"
				target="_blank"
				rel="noopener noreferrer"
				href="https://console.firebase.google.com/"
			>
				Firebase Console
			</a>
			and create a basic project with the default settings. You can name your project anything you like.
			<br /><br />

			<RoundedButton greenBlack on:click={() => step++}>
				<Icon icon="mdi:tick" />
				Done
			</RoundedButton>
		</OnboardingStep>

		<OnboardingStep bind:step idx={1} title="Enable Firebase Storage & Firestore">
			<p>
				1. Visit your Firebase project's <a
					class="text-blue-500 underline"
					target="_blank"
					rel="noopener noreferrer"
					href="https://console.firebase.google.com/u/0/project/_/storage"
				>
					Storage Tab
				</a>
				from the project console.
			</p>

			<br />

			<p>
				2. Click <span class="text-blue-300">Get Started </span> →
				<span class="text-blue-300">Start in Production Mode</span>
			</p>

			<br />

			<p>
				3. Visit your Firebase project's <a
					class="text-blue-500 underline"
					target="_blank"
					rel="noopener noreferrer"
					href="https://console.firebase.google.com/u/0/project/_/firestore"
				>
					Firestore Tab
				</a>
				from the project console.
			</p>

			<br />

			<p>
				2. Click <span class="text-blue-300">Create database </span> →
				<span class="text-blue-300">Start in Production Mode</span>
			</p>

			<br />

			<RoundedButton greenBlack on:click={() => step++}>
				<Icon icon="mdi:tick" />
				Done
			</RoundedButton>
		</OnboardingStep>

		<OnboardingStep bind:step idx={2} title="Download your Service Account File">
			<p>
				Visit your Firebase project's <a
					class="text-blue-500 underline"
					target="_blank"
					rel="noopener noreferrer"
					href="https://console.firebase.google.com/u/0/project/_/settings/serviceaccounts"
				>
					Service Accounts Page
				</a>
				and click <span class="text-blue-300">Generate new Private key</span>
			</p>
			<br />
			<p>This will download a .json file. We will need this in the next step</p>

			<br />
			<RoundedButton greenBlack on:click={() => step++}>
				<Icon icon="mdi:tick" />
				Done
			</RoundedButton>
		</OnboardingStep>

		<OnboardingStep bind:step idx={3} title="Upload your Service Account">
			To upload your serviceaccount.json file,
			<br />

			<RoundedButton
				disabled={validatingServiceAccount}
				loading={validatingServiceAccount}
				class="mt-3"
				on:click={createFilePicker}
				blueWhite>Click Here</RoundedButton
			>
		</OnboardingStep>
	</div>
</div>
