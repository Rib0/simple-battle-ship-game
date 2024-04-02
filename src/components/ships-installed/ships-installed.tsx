import { FunctionComponent } from 'preact';
import { observer } from 'mobx-react-lite';

import { Ship } from '@/components/ship';
import { useStoreContext } from '@/context/store-context';
import { getShipsStylesRelativeToTableWithRotation } from '@/utils/ship';

export const ShipsInstalled: FunctionComponent = observer(() => {
	const { gameFieldStore, shipsStore } = useStoreContext();

	const renderShips = () =>
		Object.entries(gameFieldStore.ships).map(
			([coords, { size: shipSize, rotation: shipRotation }]) => {
				const style = getShipsStylesRelativeToTableWithRotation({
					coords,
					shipSize,
					shipRotation,
				});

				const extendedStyle = {
					...style,
					...(shipsStore.activeSize
						? {
								opacity: '0.3',
							}
						: {}),
				};

				const handleClick = () => {
					gameFieldStore.activeInstalledShip = coords;
				};

				return (
					<Ship
						key={coords}
						size={shipSize}
						rotation={shipRotation}
						style={extendedStyle}
						onClick={handleClick}
					/>
				);
			},
		);

	return <>{renderShips()}</>;
});
