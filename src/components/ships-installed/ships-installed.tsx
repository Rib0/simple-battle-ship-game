import { observer } from 'mobx-react-lite';
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
				setActiveInstalledShip(coords);
			};

			const className = cx(styles.ship, {
				[styles.active]: activeInstalledShipCoords === coords,
				[styles.inactive]:
					activeSize ||
					(activeInstalledShipCoords && activeInstalledShipCoords !== coords),
			});

			const style = getShipsStylesRelativeToTableWithRotation({
				coords,
				shipSize,
				shipRotation,
			});

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
