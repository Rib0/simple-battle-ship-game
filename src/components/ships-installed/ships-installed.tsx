import { observer } from 'mobx-react-lite';
import { CSSProperties, useCallback } from 'preact/compat';
import cx from 'classnames';

import { Ship } from '@/components/ship';
import { useMatchMedia } from '@/hooks/use-match-media';
import { useStoreContext } from '@/context/store-context';
import { getShipsStylesRelativeToTableWithRotation } from '@/utils/ship';

import styles from './styles.module.css';

const MQS_MD = '(min-width: 750px)';
const MQS_LG = '(min-width: 980px)';

export const ShipsInstalled = observer(() => {
	const { gameStore, gameFieldStore, shipsStore } = useStoreContext();
	const { isStarted } = gameStore;
	const { killedShipsInitialCoords, ships, setActiveInstalledShip, activeInstalledShipCoords } =
		gameFieldStore;
	const { activeSize } = shipsStore;

	const isMatchesMdViewport = useMatchMedia(MQS_MD);
	const isMatchesLgViewport = useMatchMedia(MQS_LG);

	const renderShips = useCallback(
		() =>
			Object.entries(ships).map(([coords, { size: shipSize, rotation: shipRotation }]) => {
				const handleClick = () => {
					if (!activeSize && !isStarted) {
						const resultCoords = activeInstalledShipCoords ? null : coords;
						setActiveInstalledShip(resultCoords);
					}
				};

				const isActive = activeInstalledShipCoords === coords;
				const isKilled = killedShipsInitialCoords.has(coords);

				const className = cx(styles.ship, {
					[styles.inactive]:
						activeSize || (activeInstalledShipCoords && !isActive) || isKilled,
				});

				const style: CSSProperties = {
					...getShipsStylesRelativeToTableWithRotation({
						coords,
						shipSize,
						shipRotation,
					}),
					...{
						transform: `scale(1.${isActive ? '2' : '0'})`,
					},
				};

				return (
					<Ship
						key={coords}
						size={shipSize}
						rotation={shipRotation}
						onClick={handleClick}
						className={className}
						style={style}
					/>
				);
			}),
		// eslint-disable-next-line react-hooks/exhaustive-deps
		[
			ships,
			activeSize,
			isStarted,
			activeInstalledShipCoords,
			setActiveInstalledShip,
			isMatchesMdViewport,
			isMatchesLgViewport,
		],
	);

	return <>{renderShips()}</>;
});
