import { useState } from 'preact/hooks';

export const useBooleanState = (defaultState = false) => {
	const [state, setState] = useState(defaultState);

	const setTrue = (): void => {
		setState(true);
	};

	const setFalse = (): void => {
		setState(false);
	};

	return [state, setTrue, setFalse] as const;
};
