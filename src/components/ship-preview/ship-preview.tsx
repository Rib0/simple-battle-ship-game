import { FunctionComponent } from 'preact';
import { CSSProperties } from 'preact/compat';
import { observer } from 'mobx-react-lite';

import { Ship } from '@/components/ship';
import { Button } from '@/components/button';
import { DndDraggable } from '@/components/drag-and-drop';

import { useStoreContext } from '@/context/store-context';
import { getRotationStyles } from '@/utils/ship';

import styles from './styles.module.css';

export const ShipPreview: FunctionComponent = observer(() => {
	const { shipsStore } = useStoreContext();

	const { getActiveSize: activeSize, activeShipRotation, rotateActiveShip } = shipsStore;

	if (!activeSize) {
		return null;
	}

	const extendDraggableStyles = (style: CSSProperties): CSSProperties => ({
		...style,
		transform: `${style.transform || ''} ${getRotationStyles(activeShipRotation)}`,
	});

	return (
		<div className={styles.shipPreview}>
			<DndDraggable
				className={styles.draggable}
				extendDraggableStyles={extendDraggableStyles}
				containerDataProps={{
					'data-size': activeSize as unknown as string,
					'data-rotation': activeShipRotation as unknown as string,
				}}
			>
				<Ship size={activeSize} />
			</DndDraggable>
			<Button onClick={rotateActiveShip} />
		</div>
	);
});
