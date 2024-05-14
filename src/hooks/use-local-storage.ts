export const useLocalStorage = <T = string>(key: string) => {
	const get = () => {
		const value = localStorage.getItem(key);

		return value && (JSON.parse(value) as T);
	};

	const set = (value: T) => {
		localStorage.setItem(key, JSON.stringify(value));
	};

	const remove = () => {
		localStorage.removeItem(key);
	};

	return {
		get,
		set,
		remove,
	};
};
