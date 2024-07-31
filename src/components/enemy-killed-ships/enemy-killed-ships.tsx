import { CSSProperties } from 'preact/compat';
import { useMemo } from 'preact/hooks';
import { observer } from 'mobx-react-lite';

import { Ship } from '@/components/ship';
import { getShipsStylesRelativeToTableWithRotation } from '@/utils/ship';
import { useMediaQueries } from '@/hooks/use-media-queries';
import { useStoreContext } from '@/context/store-context';

import styles from './styles.module.css';

export const EnemyKilledShips = observer(() => {
	const { gameFieldStore } = useStoreContext();
	const { isMatchesMdViewport, isMatchesLgViewport } = useMediaQueries();

	const { enemyKilledShips } = gameFieldStore;

	const renderedShips = useMemo(
		() =>
			Object.entries(enemyKilledShips).map(
				([coords, { size: shipSize, rotation: shipRotation }]) => {
					const style: CSSProperties = getShipsStylesRelativeToTableWithRotation({
						coords,
						shipSize,
						shipRotation,
					});

					return (
						<Ship
							key={coords}
							size={shipSize}
							rotation={shipRotation}
							className={styles.inactive}
							style={style}
						/>
					);
				},
			),
		// eslint-disable-next-line react-hooks/exhaustive-deps
		[enemyKilledShips, isMatchesMdViewport, isMatchesLgViewport],
	);

	// eslint-disable-next-line react/jsx-no-useless-fragment
	return <>{renderedShips}</>;
});
