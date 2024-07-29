export const useClipboard = () => {
	const isAvailable = navigator.clipboard;

	const readText = async () => {
		let text = '';

		try {
			if (isAvailable) {
				text = await navigator.clipboard.readText();
			}
		} catch {
			// error
		}

		return text;
	};

	return { isAvailable, readText };
};
