import { NullableHTMLDivElement } from '@/components/drag-and-drop/types';
import { ShipRotation, ShipSize } from '@/types/ship';
import { arrayFromDigit } from './array-from-digit';

export const getRotationStyles = (rotation: ShipRotation) => `rotate(${rotation}deg)`;

const getShipCoords = ({
	xFirstCellPosition,
	yFirstCellPosition,
	shipSize,
	shipRotation,
}: {
	xFirstCellPosition: number;
	yFirstCellPosition: number;
	shipSize: ShipSize;
	shipRotation: ShipRotation;
}) => {
	const coords = arrayFromDigit(shipSize).map((value) => {
		let x = xFirstCellPosition;
		let y = yFirstCellPosition;

		switch (shipRotation) {
			case ShipRotation.LEFT:
			case ShipRotation.RIGHT:
				x = xFirstCellPosition + value;
				break;
			case ShipRotation.TOP:
			case ShipRotation.BOTTOM:
				y = yFirstCellPosition + value;
				break;
			default:
				break;
		}
		return `${x}-${y}`;
	});

	return coords;
};

const isShipOutsideGameField = (draggableElement: DOMRect, droppableElement: DOMRect) => {
	const isLeftOutside = draggableElement.left < droppableElement.left;
	const isBottomOutside = draggableElement.bottom > droppableElement.bottom;
	const isRightOutside = draggableElement.right > droppableElement.right;
	const isTopOutside = draggableElement.top < droppableElement.top;

	return isLeftOutside || isBottomOutside || isRightOutside || isTopOutside;
};

const getTopLeftCellShipCenter = (rect: DOMRect) => ({
	// Получает центр верхней левой палубы корабля
	x: rect.x + 20 - 10, // + ширина ячейки минус ширина border
	y: rect.y + 20 - 10,
});

const getFirstCellShipPosition = (firstCellShipCoord: number, droppableCoord: number) =>
	Math.trunc((firstCellShipCoord - droppableCoord) / 40); // 40 - ширина ячейки палубы, вынести в переменные мб

export const getShipDataByDataset = (draggableElement: HTMLDivElement) => ({
	shipSize: Number(draggableElement.dataset.size),
	shipRotation: Number(draggableElement.dataset.rotation),
});

export const getTableCoordsHoveredByShip = ({
	draggableElement,
	droppableElement,
}: {
	draggableElement: HTMLDivElement;
	droppableElement: NullableHTMLDivElement;
}) => {
	const draggableRect = draggableElement.getBoundingClientRect();
	const droppableRect = droppableElement?.getBoundingClientRect();

	if (isShipOutsideGameField(draggableRect, droppableRect!)) {
		return null;
	}

	const firstCellShipCenter = getTopLeftCellShipCenter(draggableRect);

	const { shipSize, shipRotation } = getShipDataByDataset(draggableElement);

	const xFirstCellPosition = getFirstCellShipPosition(firstCellShipCenter.x, droppableRect!.x);
	const yFirstCellPosition = getFirstCellShipPosition(firstCellShipCenter.y, droppableRect!.y);

	const coords = getShipCoords({
		xFirstCellPosition,
		yFirstCellPosition,
		shipSize,
		shipRotation,
	});

	return coords;
};

export const getShipsCoordsRelativeToTable = (coords: string) => {
	const [x, y] = coords.split('-');

	const xShipCoord = Number(x) * 40 + 10 + 1; // сдвиг из-за разницы в ширине палубы и ячейки таблицы в 2 пикселя
	const yShipCoord = Number(y) * 40 + 10 + 1;

	return {
		x: xShipCoord,
		y: yShipCoord,
	};
};

export const getShipPositionForInstall = ({
	draggableElement,
	droppableElement,
}: {
	draggableElement: HTMLDivElement;
	droppableElement: NullableHTMLDivElement;
}) => {
	const draggableRect = draggableElement.getBoundingClientRect();
	const droppableRect = droppableElement?.getBoundingClientRect();

	if (isShipOutsideGameField(draggableRect, droppableRect!)) {
		return null;
	}

	const [firstShipCellCoords] = getTableCoordsHoveredByShip({
		draggableElement,
		droppableElement,
	})!;

	const { x, y } = getShipsCoordsRelativeToTable(firstShipCellCoords);

	const xShipCoord = x + droppableRect!.left;
	const yShipCoord = y + droppableRect!.top;

	return {
		x: draggableRect.left - xShipCoord,
		y: draggableRect.top - yShipCoord,
	};
};

export const getShipsStylesRelativeToTableWithRotation = ({
	coords,
	size,
	rotation,
}: {
	coords: string;
	size: ShipSize;
	rotation: ShipRotation;
}) => {
	const { x, y } = getShipsCoordsRelativeToTable(coords);

	const shipWidth = 38; // размер палубы корабля

	switch (rotation) {
		case ShipRotation.TOP:
		case ShipRotation.BOTTOM: {
			const shipLength = size * shipWidth;
			const diff = (shipLength - shipWidth) / 2;
			return {
				x: x - diff,
				y: y + diff,
			};
		}
		default:
			return {
				x,
				y,
			};
	}
};
