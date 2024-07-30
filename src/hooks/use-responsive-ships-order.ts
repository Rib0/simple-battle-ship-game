import { useEffect } from 'preact/hooks';

import { useStoreContext } from '@/context/store-context';
import { useMatchMedia } from './use-match-media';

const MQS_MD = '(min-width: 750px)';
const MQS_LG = '(min-width: 980px)';

export const useResponsiveShipsOrder = () => {
	const isMatchesMdViewport = useMatchMedia(MQS_MD);
	const isMatchesLgViewport = useMatchMedia(MQS_LG);

	const { gameFieldStore } = useStoreContext();

	useEffect(() => {
		// TODO: при изменении переустанавливать все корабли в таблице
	}, [isMatchesMdViewport, isMatchesLgViewport, gameFieldStore]);
};
