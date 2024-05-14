import { CSSProperties } from 'preact/compat';
import { observer } from 'mobx-react-lite';
import cx from 'classnames';

import { Ship } from '@/components/ship';
import { Button } from '@/components/button';
import { DndDraggable } from '@/components/drag-and-drop';

import { useSocketGameEvents } from '@/hooks/use-socket-game-events';
import { useStoreContext } from '@/context/store-context';
import { getShipRotationStyles } from '@/utils/ship';

import styles from './styles.module.css';

export const StartGameActions = observer(() => {
	const { shipsStore, gameFieldStore } = useStoreContext();
	const { searchGame } = useSocketGameEvents();

	const { activeSize, activeSizeRotation, rotateActiveShip, setActiveSize, isAllShipsInstalled } =
		shipsStore;
	const {
		activeInstalledShipCoords,
		removeActiveInstalledShip,
		randomlyInstallShips,
		resetAllShips,
	} = gameFieldStore;

	const extendDraggableStyles = (style: CSSProperties): CSSProperties => ({
		...style,
		transform: `${style.transform || ''} ${getShipRotationStyles(activeSizeRotation)}`,
	});

	const handleClickCancelButton = () => {
		if (activeSize) {
			setActiveSize(null);
		} else if (activeInstalledShipCoords) {
			removeActiveInstalledShip();
		} else if (isAllShipsInstalled) {
			resetAllShips();
		}
	};

	return (
		<div className={styles.root}>
			{activeSize && (
				<DndDraggable
					className={styles.draggable}
					extendDraggableStyles={extendDraggableStyles}
					containerDataProps={{
						'data-size': activeSize as unknown as string,
						'data-rotation': activeSizeRotation as unknown as string,
					}}
				>
					<Ship size={activeSize} />
				</DndDraggable>
			)}
			<div className={styles.buttons}>
				{!activeSize && !activeInstalledShipCoords && (
					<Button type="shuffle_ships" onClick={randomlyInstallShips} />
				)}
				{activeSize && <Button type="rotate_ship" onClick={rotateActiveShip} />}
				{(activeSize || activeInstalledShipCoords || isAllShipsInstalled) && (
					<Button type="cancel" onClick={handleClickCancelButton} />
				)}
				<div className={cx(styles.fullWidth, !isAllShipsInstalled && styles.inactive)}>
					<Button type="start_battle" onClick={searchGame} />
				</div>
			</div>
		</div>
	);
});
