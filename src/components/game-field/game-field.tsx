import { useState } from 'preact/hooks';
import { observer } from 'mobx-react-lite';
import { Flex } from 'antd';

import { DndProvider } from '@/components/common/drag-and-drop';
import { SetupForGame } from '@/components/setup-for-game';
import { TableWithActions, TableEnemyWithInfo } from '@/components/tables';
import type { DndContextOptionsType } from '@/components/common/drag-and-drop/types';
import { useStoreContext } from '@/context/store-context';
import {
	getShipDataByDataset,
	getShipInstallShiftRelativeToTable,
	getTableCoordsHoveredByShip,
	checkIfShipOverInactiveTableCoords,
} from '@/utils/ship';
import { Nullable } from '@/types/utils';
import { TurnArrow } from '../turn-arrow';

export const GameField = observer(() => {
	const { gameStore, gameFieldStore } = useStoreContext();
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

		const shiftForInstall = getShipInstallShiftRelativeToTable(
			draggableElement,
			droppableElement,
		);

		if (shiftForInstall) {
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

			updateOffset(shiftForInstall, callback);
			setHoveredCoords(null);
		} else {
			setInitialOffset();
		}
	};

	return (
		<DndProvider onDragMove={handleDragMove} onDragEnd={handleDragEnd}>
			<Flex gap="middle" align={gameStore.isStarted ? 'flex-end' : ''}>
				<Flex flex="0 0 auto">
					<TableWithActions hoveredCoords={hoveredCoords} />
				</Flex>
				{!gameStore.isStarted && <SetupForGame />}
				{gameStore.isStarted && (
					<>
						<TurnArrow />
						<Flex flex="0 1 auto">
							<TableEnemyWithInfo />
						</Flex>
					</>
				)}
			</Flex>
		</DndProvider>
	);
});
