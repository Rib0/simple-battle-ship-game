import { useLayoutEffect, useState } from 'preact/hooks';

export const useMatchMedia = (mediaQueryString: string) => {
	const mql = window.matchMedia(mediaQueryString);

	const [isMatches, setIsMatches] = useState(mql.matches);

	useLayoutEffect(() => {
		const handleMqlChange = ({ matches }: { matches: boolean }) => {
			setIsMatches(matches);
		};

		mql.addEventListener('change', handleMqlChange);
		return () => mql.removeEventListener('change', handleMqlChange);
	}, [mql]);

	return isMatches;
};
