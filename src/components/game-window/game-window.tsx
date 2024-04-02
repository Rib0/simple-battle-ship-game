import { FunctionComponent } from 'preact';
import { useState } from 'preact/hooks';
import { observer } from 'mobx-react-lite';

import { DndProvider } from '@/components/drag-and-drop';
import { DndDroppable } from '@/components/drag-and-drop/dnd-droppable';
import { Table } from '@/components/table';
import { ShipsForInstall } from '@/components/ships-for-install';
import { ShipPreview } from '@/components/ship-preview';
import type { DndContextOptionsType } from '@/components/drag-and-drop/types';
import { useStoreContext } from '@/context/store-context';
import {
	getShipDataByDataset,
	getShipPositionForInstall,
	getTableCoordsHoveredByShip,
	isCantInstallShip,
} from '@/utils/ship';
import { Nullable } from '@/types/utils';

import styles from './styles.module.css';

export const GameWindow: FunctionComponent = observer(() => {
	const { gameFieldStore } = useStoreContext();

	const [hoveredCoords, setHoveredCoords] = useState<Nullable<string[]>>(null);

	const handleDragMove: DndContextOptionsType['onDragMove'] = (data) => {
		const { draggableElement, droppableElement } = data;

		const coords = getTableCoordsHoveredByShip({ draggableElement, droppableElement });

		if (coords && isCantInstallShip(coords, gameFieldStore.getInactiveCoordsForInstall)) {
			setHoveredCoords(null);
			return;
		}

		setHoveredCoords(coords);
	};

	const handleDragEnd: DndContextOptionsType['onDragEnd'] = (
		data,
		{ updateOffset, setInitialOffset },
	) => {
		const { draggableElement, droppableElement } = data;

		const positionForInstall = getShipPositionForInstall({
			draggableElement,
			droppableElement,
		});

		if (positionForInstall) {
			const { shipRotation, shipSize } = getShipDataByDataset(draggableElement);
			const shipCoords = getTableCoordsHoveredByShip({ draggableElement, droppableElement })!;

			if (isCantInstallShip(shipCoords, gameFieldStore.getInactiveCoordsForInstall)) {
				setInitialOffset();
				return;
			}

			const callback = () => {
				gameFieldStore.installShip({ shipCoords, shipRotation, shipSize });
			};

			updateOffset(positionForInstall, callback);
			setHoveredCoords(null);
		} else {
			setInitialOffset();
		}
	};

	return (
		<DndProvider
			onDragMove={handleDragMove}
			onDragEnd={handleDragEnd}
			className={styles.gameWindow}
		>
			<DndDroppable>
				<Table hoveredCoords={hoveredCoords} />
			</DndDroppable>
			<div className={styles.ships}>
				<ShipsForInstall />
				<ShipPreview />
			</div>
		</DndProvider>
	);
});
