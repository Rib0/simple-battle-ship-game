import { useCallback } from 'preact/hooks';

import { Keys } from '@/constants/locale-storage';

export const useLocalStorage = <T = string>(key: Keys) => {
	const get = useCallback(() => {
		const value = localStorage.getItem(key);

		return value && (JSON.parse(value) as T);
	}, [key]);

	const set = useCallback(
		(value: T) => {
			localStorage.setItem(key, JSON.stringify(value));
		},
		[key],
	);

	const remove = useCallback(() => {
		localStorage.removeItem(key);
	}, [key]);

	return {
		get,
		set,
		remove,
	};
};
