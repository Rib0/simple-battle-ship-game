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
	getShipInstallShiftRelativeToTable,
	getTableCoordsHoveredByShip,
	checkIfShipOverInactiveTableCoords,
} from '@/utils/ship';
import { Nullable } from '@/types/utils';

import styles from './styles.module.css';

export const GameWindow = observer(() => {
	const { gameFieldStore } = useStoreContext();
	const { getInactiveCoordsForInstall } = gameFieldStore;

	const [hoveredCoords, setHoveredCoords] = useState<Nullable<string[]>>(null);

	const handleDragMove: DndContextOptionsType['onDragMove'] = (data) => {
		const { draggableElement, droppableElement } = data;

		const tableCoordsHoveredByShip = getTableCoordsHoveredByShip(
			draggableElement,
			droppableElement,
		);

		if (tableCoordsHoveredByShip) {
			const isShipOverInactiveTableCoords = checkIfShipOverInactiveTableCoords(
				tableCoordsHoveredByShip,
				getInactiveCoordsForInstall,
			);

			if (isShipOverInactiveTableCoords) {
				setHoveredCoords(null);
			} else {
				setHoveredCoords(tableCoordsHoveredByShip);
			}
		} else {
			setHoveredCoords(null);
		}
	};

	const handleDragEnd: DndContextOptionsType['onDragEnd'] = (
		data,
		{ updateOffset, setInitialOffset },
	) => {
		const { draggableElement, droppableElement } = data;

		const positionForInstall = getShipInstallShiftRelativeToTable(
			draggableElement,
			droppableElement,
		);

		if (positionForInstall) {
			const { shipRotation, shipSize } = getShipDataByDataset(draggableElement);
			const tableCoordsHoveredByShip = getTableCoordsHoveredByShip(
				draggableElement,
				droppableElement,
			)!;

			if (
				checkIfShipOverInactiveTableCoords(
					tableCoordsHoveredByShip,
					getInactiveCoordsForInstall,
				)
			) {
				setInitialOffset();
				return;
			}

			const callback = () => {
				gameFieldStore.installShip({
					shipCoords: tableCoordsHoveredByShip,
					shipRotation,
					shipSize,
				});
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
