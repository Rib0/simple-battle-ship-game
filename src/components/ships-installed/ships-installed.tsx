import { observer } from 'mobx-react-lite';
import { CSSProperties } from 'preact/compat';
import cx from 'classnames';

import { Ship } from '@/components/ship';
import { useStoreContext } from '@/context/store-context';
import { getShipsStylesRelativeToTableWithRotation } from '@/utils/ship';

import styles from './styles.module.css';

export const ShipsInstalled = observer(() => {
	const { gameFieldStore, shipsStore } = useStoreContext();

	const { ships, setActiveInstalledShip, activeInstalledShipCoords } = gameFieldStore;
	const { activeSize } = shipsStore;

	const renderShips = () =>
		Object.entries(ships).map(([coords, { size: shipSize, rotation: shipRotation }]) => {
			const handleClick = () => {
				if (!activeSize) {
					setActiveInstalledShip(coords);
				}
			};

			const isActive = activeInstalledShipCoords === coords;

			const className = cx(styles.ship, {
				[styles.inactive]: activeSize || (activeInstalledShipCoords && !isActive),
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
		});

	return <>{renderShips()}</>;
});
