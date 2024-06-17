import { CSSProperties, useState } from 'preact/compat';
import { observer } from 'mobx-react-lite';
import cx from 'classnames';

import { Ship } from '@/components/ship';
import { Input } from '@/components/common/input';
import { Button } from '@/components/common/button';
import { DndDraggable } from '@/components/common/drag-and-drop';

import { useSocketGameEvents } from '@/hooks/use-socket-game-events';
import { useStoreContext } from '@/context/store-context';
import { getShipRotationStyles } from '@/utils/ship';

import styles from './styles.module.css';

export const StartGameActions = observer(() => {
	const [id, setId] = useState('');
	const { shipsStore, gameFieldStore } = useStoreContext();
	const { searchGame, inviteById } = useSocketGameEvents();

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

	const handleChangeId = (value: string) => {
		setId(value);
	};

	const handleGoToBattleClick = () => {
		const trimmedId = id.trim();

		if (trimmedId) {
			inviteById(id);
		} else {
			searchGame();
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
				<div
					className={cx(
						styles.fullWidth,
						styles.container,
						!isAllShipsInstalled && styles.inactive,
					)}
				>
					<Button type="start_battle" onClick={handleGoToBattleClick} />
					<Input onChange={handleChangeId} placeholder="Пригласить по id" />
				</div>
			</div>
		</div>
	);
});
