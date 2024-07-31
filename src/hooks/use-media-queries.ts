import { useMatchMedia } from './use-match-media';

const MQS_MD = '(min-width: 750px)';
const MQS_LG = '(min-width: 980px)';

export const useMediaQueries = () => {
	const isMatchesMdViewport = useMatchMedia(MQS_MD);
	const isMatchesLgViewport = useMatchMedia(MQS_LG);

	return {
		isMatchesMdViewport,
		isMatchesLgViewport,
	};
};
