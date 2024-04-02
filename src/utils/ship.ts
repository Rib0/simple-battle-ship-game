import { NullableHTMLDivElement } from '@/components/drag-and-drop/types';
import { TABLE_SIDE_SIZE } from '@/constants/table';
import { ShipRotation, ShipSize } from '@/types/ship';
import { arrayFromDigit } from './array-from-digit';
import { formatCoords, parseCoords } from './table';

export const getRotationStyles = (shipRotation: ShipRotation) => `rotate(${shipRotation}deg)`;

export const getShipCoords = ({
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
		return formatCoords({ x, y });
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
	x: rect.x + 20 - 10,
	y: rect.y + 20 - 10,
});

const getFirstCellShipPosition = (firstCellShipCoord: number, droppableCoord: number) =>
	Math.trunc((firstCellShipCoord - droppableCoord) / 40); // 40 - ширина ячейки таблицы, вынести в переменные мб

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

const getShipsPositionRelativeToTable = (coords: string) => {
	const [[x, y]] = parseCoords(coords);

	const leftShipCoord = x * 40 + 10 + 1; // сдвиг из-за разницы в ширине палубы и ячейки таблицы в 2 пикселя
	const rightShipCoord = (TABLE_SIDE_SIZE - 1 - x) * 40 + 10 + 1;
	const topShipCoord = y * 40 + 10 + 1;

	return {
		left: leftShipCoord,
		right: rightShipCoord,
		top: topShipCoord,
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

	const { left, top } = getShipsPositionRelativeToTable(firstShipCellCoords);

	const xShipCoord = left + droppableRect!.left;
	const yShipCoord = top + droppableRect!.top;

	return {
		x: draggableRect.left - xShipCoord,
		y: draggableRect.top - yShipCoord,
	};
};

export const isCantInstallShip = (shipCoords: string[], inactiveCoordsForInstall: Set<string>) =>
	shipCoords.some((shipCoord) => inactiveCoordsForInstall.has(shipCoord));

export const getShipsStylesRelativeToTableWithRotation = ({
	coords,
	shipSize,
	shipRotation,
}: {
	coords: string;
	shipSize: ShipSize;
	shipRotation: ShipRotation;
}) => {
	const { left, right, top } = getShipsPositionRelativeToTable(coords);
	const [[x]] = parseCoords(coords);

	const isVerticalRotation = [ShipRotation.TOP, ShipRotation.BOTTOM].includes(shipRotation);
	const targetHorizontalCoordKey = x > 4 && isVerticalRotation ? 'right' : 'left';
	const targetHorizontalCoord = x > 4 && isVerticalRotation ? right : left;

	const shipWidth = 38; // TODO: размер палубы корабля, вынести в переменные

	const styles = {
		position: 'absolute',
		top: `${top}px`,
		[targetHorizontalCoordKey]: `${targetHorizontalCoord}px`,
	};

	switch (shipRotation) {
		case ShipRotation.TOP:
		case ShipRotation.BOTTOM: {
			const shipLength = shipSize * shipWidth;
			const diff = (shipLength - shipWidth) / 2;
			styles.top = `${top + diff}px`;
			styles[targetHorizontalCoordKey] = `${targetHorizontalCoord - diff}px`;
			break;
		}
		default:
			break;
	}

	return styles;
};
