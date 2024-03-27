import { FunctionComponent } from 'preact';
import { useState } from 'preact/hooks';
import { observer } from 'mobx-react-lite';

import { DndProvider } from '@/components/drag-and-drop';
import { DndDroppable } from '@/components/drag-and-drop/dnd-droppable';
import type { DndContextOptionsType } from '@/components/drag-and-drop/types';
import { Table } from '@/components/table';
import { ShipsForInstall } from '@/components/ships-for-install';
import { ShipPreview } from '@/components/ship-preview';

import { useStoreContext } from '@/context/store-context';

import {
	getShipDataByDataset,
	getShipPositionForInstall,
	getTableCoordsHoveredByShip,
} from '@/utils/ship';

import styles from './styles.module.css';

/* TODO:
	Логика для кораблей:
		1. При добавлении корабля в таблицу делать его невидимым в компоненте ships, для этого кажому кораблю нужно присвоить id, id присваивать во время добавления в массив установленных кораблей
		3. Дать возможность отменить постановку корабля, для этого на таблице он должен быть кликабельным
*/

// НУЖНО ЛИ ОБОРАЧИВАТЬ В OBSERVER КОМПОНЕНТЫ В КОТОРЫЕ ПЕРЕДАЕШЬ ПРОПСЫ из стора

export const GameWindow: FunctionComponent = observer(() => {
	const { gameFieldStore } = useStoreContext();

	const [hoveredCoords, setHoveredCoords] =
		useState<ReturnType<typeof getTableCoordsHoveredByShip>>(null);

	const handleDragMove: DndContextOptionsType['onDragMove'] = (data) => {
		const { draggableElement, droppableElement } = data;

		const coords = getTableCoordsHoveredByShip({ draggableElement, droppableElement });
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
			const { shipRotation: rotation, shipSize: size } =
				getShipDataByDataset(draggableElement);

			const callback = () => {
				gameFieldStore.installShip({ coords: hoveredCoords![0], rotation, size });
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
