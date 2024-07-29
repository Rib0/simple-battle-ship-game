import { useEffect, useState } from 'preact/hooks';
import { Modal } from 'antd';

import { checkIsMobile } from '@/utils/check-is-mobile';
import { useMatchMedia } from './use-match-media';

const mqs = '(orientation: landscape)';

let modal: ReturnType<typeof Modal.confirm>;

export const useOrientation = () => {
	const isMobile = checkIsMobile();
	const isMatches = useMatchMedia(mqs);

	const [isNeedChangeOrientation, setIsNeedChangeOrientation] = useState(isMobile && !isMatches);

	useEffect(() => {
		if (!isMobile) {
			modal?.destroy();
			return;
		}

		setIsNeedChangeOrientation(!isMatches);

		if (!isMatches) {
			modal = Modal.confirm({
				title: 'Переверните телефон',
				content: 'Играть можно только в горизонтальном режиме',
				centered: true,
				footer: null,
			});
		}

		// eslint-disable-next-line consistent-return
		return () => modal?.destroy();
	}, [isMobile, isMatches]);

	return isNeedChangeOrientation;
};
