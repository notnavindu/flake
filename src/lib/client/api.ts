import FormData from 'form-data';
import type { Tweened } from 'svelte/motion';
import axios from 'axios';

export let uploadMedia = async (image: any, progreeRef: Tweened<number> | null = null) => {
	// progreeRef: Tweened<number> = null

	let data = new FormData();
	data.append('media', image);

	return await axios
		.post('/api/file', data, {
			onUploadProgress: (progressEvent) => {
				// if (progressEvent) {
				// 	let percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total!);
				// 	console.log(percentCompleted);
				// }

				if (progreeRef && progressEvent.total) {
					let percentCompleted = Math.round((progressEvent.loaded * 95) / progressEvent.total);
					progreeRef.set(percentCompleted);
				} else {
					console.log('prog event null');
				}
			}
		})
		.then((res) => {
			return res.data?.location;
		})
		.catch((err) => {
			return { error: err.response.status };
		});
};
