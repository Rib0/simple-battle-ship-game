import { CSSProperties } from 'preact/compat';
import { observer } from 'mobx-react-lite';

import { Ship } from '@/components/ship';
import { Button } from '@/components/button';
import { DndDraggable } from '@/components/drag-and-drop';

import { useStoreContext } from '@/context/store-context';
import { getShipRotationStyles } from '@/utils/ship';

import styles from './styles.module.css';

export const ShipPreview = observer(() => {
	const { shipsStore, gameFieldStore } = useStoreContext();

	const { activeSize, activeSizeRotation, rotateActiveShip, setActiveSize } = shipsStore;
	const { activeInstalledShipCoords, removeActiveInstalledShip } = gameFieldStore;

	if (!activeSize && !activeInstalledShipCoords) {
		return null;
	}

	const extendDraggableStyles = (style: CSSProperties): CSSProperties => ({
		...style,
		transform: `${style.transform || ''} ${getShipRotationStyles(activeSizeRotation)}`,
	});

	const handleClickCancelButton = () => {
		if (activeSize) {
			setActiveSize(null);
		} else {
			removeActiveInstalledShip();
		}
	};

	return (
		<div className={styles.shipPreview}>
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
				{activeSize && <Button type="rotate_ship" onClick={rotateActiveShip} />}
				<Button type="cancel" onClick={handleClickCancelButton} />
			</div>
		</div>
	);
});
