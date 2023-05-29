import axios from 'axios';
import FormData from 'form-data';
import type { Tweened } from 'svelte/motion';

export let uploadMedia = async (image: any, progreeRef: Tweened<number> | null = null) => {
	let data = new FormData();
	data.append('media', image);

	return await axios
		.post('/api/file', data, {
			onUploadProgress: (progressEvent) => {
				if (progreeRef && progressEvent.total) {
					let percentCompleted = Math.round((progressEvent.loaded * 96) / progressEvent.total);
					progreeRef.set(percentCompleted);
				}
			}
		})
		.then((res) => {
			return res.data?.id;
		})
		.catch((err) => {
			return { error: err.response.status };
		});
};

export let validateAndSaveServiceAccount = async (account: object) => {
	return await axios.post('/api/service-account', { account }).then(({ data }) => {
		return data;
	});
};

export let deleteVideo = async (videoId: string) => {
	return await axios.delete(`/api/flake/${videoId}`).then(({ data }) => {
		return data;
	});
};

export let updateVideoTitle = async (videoId: string, name: string) => {
	return await axios.patch(`/api/flake/${videoId}`, { name }).then(({ data }) => {
		return data;
	});
};

export let getDeepgramState = async () => {
	return await axios.get('/api/deepgram').then(({ data }) => {
		return data;
	});
};
