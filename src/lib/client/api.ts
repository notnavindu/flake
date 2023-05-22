import FormData from 'form-data';
import type { Tweened } from 'svelte/motion';
import axios from 'axios';

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
