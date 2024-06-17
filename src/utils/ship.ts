import { NullableHTMLDivElement } from '@/components/common/drag-and-drop/types';
import { LAST_TABLE_SIDE_INDEX, TABLE_SIDE_SIZE } from '@/constants/table';
import { ShipRotation, ShipSize } from '@/types/ship';
import { arrayFromDigit } from './array-from-digit';
import {
	formatCoords,
	getCellsCoordsAroundShip,
	getFormattedTableCoords,
	parseCoords,
} from './table';
import { shuffle } from './shuffle';

export const getShipRotationStyles = (shipRotation: ShipRotation) => `rotate(${shipRotation}deg)`;

export const getShipsAmount = (): Record<ShipSize, number> => ({
	[ShipSize.FOUR]: 1,
	[ShipSize.THREE]: 2,
	[ShipSize.TWO]: 3,
	[ShipSize.ONE]: 4,
});

export const getArrayOfShipsAmount = (shipsAmount: Record<ShipSize, number>) =>
	Object.entries(shipsAmount).reduce(
		(acc, [shipSize, amount]) => [
			...acc,
			...new Array<ShipSize>(amount).fill(Number(shipSize) as unknown as ShipSize),
		],
		[] as ShipSize[],
	);

/*
	Координаты - x, y координаты ячеек таблицы от 0 до 9
	Позиция - позиционирование в пикселях элемента dom, относительно таблицы либо viewport
*/

/*
	Возвращает миссив координат всех палуб корабля в форматированном виде
	Принимает координаты верхней, левой палубы корабля, размер корабля и его поворот
*/
export const getShipCoords = ({
	xFirstCellCoord,
	yFirstCellCoord,
	shipSize,
	shipRotation,
}: {
	xFirstCellCoord: number;
	yFirstCellCoord: number;
	shipSize: ShipSize;
	shipRotation: ShipRotation;
}) => {
	const coords = arrayFromDigit(shipSize).map((value) => {
		let x = xFirstCellCoord;
		let y = yFirstCellCoord;

		switch (shipRotation) {
			case ShipRotation.LEFT:
			case ShipRotation.RIGHT:
				x = xFirstCellCoord + value;
				break;
			case ShipRotation.TOP:
			case ShipRotation.BOTTOM:
				y = yFirstCellCoord + value;
				break;
			default:
				break;
		}
		return formatCoords({ x, y });
	});

	return coords;
};

/* 
	Возращает true, если иконка корабля находится за границами таблицы
	Принимает результат getBoundingClientRect корабля и таблицы
*/
const isShipOutsideGameField = (draggableElement: DOMRect, droppableElement: DOMRect) => {
	const isLeftOutside = draggableElement.left < droppableElement.left;
	const isBottomOutside = draggableElement.bottom > droppableElement.bottom;
	const isRightOutside = draggableElement.right > droppableElement.right;
	const isTopOutside = draggableElement.top < droppableElement.top;

	return isLeftOutside || isBottomOutside || isRightOutside || isTopOutside;
};

/* 
	Возвращает позицию центра верхней левой палубы корабля в пикселях
	Принимает результат getBoundingClientRect корабля
	Результат получаем путем прибавления половины ширины палубы и вычитания ширины одного border таблицы из верхней левой координате корабля  
*/
const getTopLeftCellShipCenterPosition = (rect: DOMRect) => ({
	x: rect.x + 20 - 10,
	y: rect.y + 20 - 10,
});

/*
	Возвращает координаты центра верхней левой палубы корабля
	Принимает в пикселях позиции первой палубы корабля и верхнего левого угла таблицы
*/
const getFirstCellShipCoords = (firstCellShipCoord: number, droppableCoord: number) =>
	Math.trunc((firstCellShipCoord - droppableCoord) / 40); // 40 - ширина ячейки таблицы, вынести в переменные мб

export const getShipDataByDataset = (draggableElement: HTMLDivElement) => ({
	shipSize: Number(draggableElement.dataset.size),
	shipRotation: Number(draggableElement.dataset.rotation),
});

/* 
	Возвращает массив координат таблицы в форматированном виде над которым находится корабли в режиме dnd, если корабль находится вне таблицы, возвращает null
	Принимает результат getBoundingClientRect корабля и таблицы
*/
export const getTableCoordsHoveredByShip = (
	draggableElement: HTMLDivElement,
	droppableElement: NullableHTMLDivElement,
) => {
	const draggableRect = draggableElement.getBoundingClientRect();
	const droppableRect = droppableElement?.getBoundingClientRect();

	if (isShipOutsideGameField(draggableRect, droppableRect!)) {
		return null;
	}

	const firstCellShipCenterPosition = getTopLeftCellShipCenterPosition(draggableRect);

	const { shipSize, shipRotation } = getShipDataByDataset(draggableElement);

	const xFirstCellCoord = getFirstCellShipCoords(firstCellShipCenterPosition.x, droppableRect!.x);
	const yFirstCellCoord = getFirstCellShipCoords(firstCellShipCenterPosition.y, droppableRect!.y);

	const coords = getShipCoords({
		xFirstCellCoord,
		yFirstCellCoord,
		shipSize,
		shipRotation,
	});

	return coords;
};

/*
	Возвращает позицию корабля относительно таблицы
	Принимает координаты верхней левой палубы корабля
*/
const getShipPositionRelativeToTable = (firstCellShipCoords: string) => {
	const [[x, y]] = parseCoords(firstCellShipCoords);

	const left = x * 40 + 10 + 1; // сдвиг из-за разницы в ширине палубы и ячейки таблицы в 2 пикселя
	const right = (TABLE_SIDE_SIZE - 1 - x) * 40 + 10 + 1;
	const top = y * 40 + 10 + 1;

	return {
		left,
		right,
		top,
	};
};

/*
	Возвращает сдвиг корабля в пикселях относительно таблицы, на который нужно переместить корабль, чтобы ровно установить его в таблицу, если корабль вне таблицы возвращает null
	Принимает ref ссылки на dom элементы корабля и таблицы
*/
export const getShipInstallShiftRelativeToTable = (
	draggableElement: HTMLDivElement,
	droppableElement: NullableHTMLDivElement,
) => {
	const draggableRect = draggableElement.getBoundingClientRect();
	const droppableRect = droppableElement?.getBoundingClientRect();

	if (isShipOutsideGameField(draggableRect, droppableRect!)) {
		return null;
	}

	const [firstCellShipCoords] = getTableCoordsHoveredByShip(draggableElement, droppableElement)!;

	const { left, top } = getShipPositionRelativeToTable(firstCellShipCoords);

	const xShipCoord = left + droppableRect!.left;
	const yShipCoord = top + droppableRect!.top;

	return {
		x: draggableRect.left - xShipCoord,
		y: draggableRect.top - yShipCoord,
	};
};

export const checkIfShipOverInactiveTableCoords = (
	shipCoords: string[],
	inactiveTableCoordsForInstall: Set<string>,
) => shipCoords.some((shipCoord) => inactiveTableCoordsForInstall.has(shipCoord));

/*
	Вовзращает стили для корабля, который будет установлен в таблицу
*/
export const getShipsStylesRelativeToTableWithRotation = ({
	coords,
	shipSize,
	shipRotation,
}: {
	coords: string;
	shipSize: ShipSize;
	shipRotation: ShipRotation;
}) => {
	const { left, right, top } = getShipPositionRelativeToTable(coords);
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

export const getRandomlyInstalledShips = () => {
	const shuffledTableCoords = shuffle(getFormattedTableCoords());
	const inactiveTableCoords = new Set();
	const shipsForInstall = getArrayOfShipsAmount(getShipsAmount()).reverse();
	const shipRotations = [ShipRotation.TOP, ShipRotation.LEFT];
	const resultShipsInfo: Array<{
		shipCoords: string[];
		shipRotation: ShipRotation;
		shipSize: ShipSize;
	}> = [];
	let goNextShip = false;

	for (let i = 0; i < shipsForInstall.length; i++) {
		const shipSize = shipsForInstall[i];

		// eslint-disable-next-line no-restricted-syntax
		for (const coords of shuffledTableCoords) {
			if (goNextShip) {
				goNextShip = false;
				break;
			}

			const [[xFirstCellCoord, yFirstCellCoord]] = parseCoords(coords);

			// eslint-disable-next-line no-restricted-syntax
			for (const shipRotation of shipRotations) {
				const shipCoords = getShipCoords({
					xFirstCellCoord,
					yFirstCellCoord,
					shipSize,
					shipRotation,
				});

				const hasInvalidCoords = shipCoords.some((c) => {
					const [[x, y]] = parseCoords(c);

					return (
						x < 0 ||
						x > LAST_TABLE_SIDE_INDEX ||
						y < 0 ||
						y > LAST_TABLE_SIDE_INDEX ||
						inactiveTableCoords.has(c)
					);
				});

				if (hasInvalidCoords) {
					// eslint-disable-next-line no-continue
					continue;
				} else {
					const cellsAroundShip = getCellsCoordsAroundShip({
						shipCoords,
						shipSize,
						shipRotation,
					});
					cellsAroundShip.forEach((cell) => inactiveTableCoords.add(cell));

					resultShipsInfo.push({ shipCoords, shipRotation, shipSize });
					goNextShip = true;
					break;
				}
			}
		}
	}

	return resultShipsInfo;
};
