import { observer } from 'mobx-react-lite';
import { CSSProperties, useMemo } from 'preact/compat';
import cx from 'classnames';

import { Ship } from '@/components/ship';
import { useMediaQueries } from '@/hooks/use-media-queries';
import { useStoreContext } from '@/context/store-context';
import { getShipsStylesRelativeToTableWithRotation } from '@/utils/ship';

import styles from './styles.module.css';

export const ShipsInstalled = observer(() => {
	const { gameStore, gameFieldStore, shipsStore } = useStoreContext();
	const { isStarted, isSearching, isAwaitingInvitationResponse } = gameStore;
	const { killedShipsInitialCoords, ships, setActiveInstalledShip, activeInstalledShipCoords } =
		gameFieldStore;
	const { activeSize } = shipsStore;

	const { isMatchesMdViewport, isMatchesLgViewport } = useMediaQueries();

	const renderedShips = useMemo(
		() =>
			Object.entries(ships).map(([coords, { size: shipSize, rotation: shipRotation }]) => {
				const handleClick = () => {
					if (activeSize || isStarted || isSearching || isAwaitingInvitationResponse) {
						return;
					}

					const resultCoords = activeInstalledShipCoords ? null : coords;
					setActiveInstalledShip(resultCoords);
				};

				const isActive = activeInstalledShipCoords === coords;
				const isKilled = killedShipsInitialCoords.includes(coords);

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
			isSearching,
			isAwaitingInvitationResponse,
			activeInstalledShipCoords,
			killedShipsInitialCoords.length,
			setActiveInstalledShip,
			isMatchesMdViewport,
			isMatchesLgViewport,
		],
	);

	// eslint-disable-next-line react/jsx-no-useless-fragment
	return <>{renderedShips}</>;
});
