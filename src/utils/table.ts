import { ShipRotation, ShipSize } from '@/types/ship';

import {
	DIFF_AROUND,
	DIFF_HORIZONTAL,
	DIFF_LAST_INDEX,
	DIFF_MIDDLE_INDEX,
	DIFF_VERTICAL,
} from '@/constants/diff-coords';
import { LAST_TABLE_SIDE_INDEX, TABLE_SIDE_SIZE } from '@/constants/table';
import { Coords } from '@/types/game-field';
import { arrayFromDigit } from './array-from-digit';

export const parseCoords = (coords: string | string[]) => {
	const tempCoords = Array.isArray(coords) ? coords : [coords];

	return tempCoords.map((coord) => coord.split('-').map(Number));
};

export const formatCoords = ({ x, y }: Coords) => `${x}-${y}`;

export const getCellsCoordsAroundCell = ([x, y]: number[], diffCoords: number[][]) =>
	diffCoords.map(([diffX, diffY]) => {
		const resultX = x + diffX;
		const resultY = y + diffY;

		if (
			resultX < 0 ||
			resultY < 0 ||
			resultX > LAST_TABLE_SIDE_INDEX ||
			resultY > LAST_TABLE_SIDE_INDEX
		) {
			return null;
		}

		return [resultX, resultY];
	});

export const getCellsCoordsAroundShip = ({
	shipCoords,
	shipSize,
	shipRotation,
	withShipCoords = true,
}: {
	shipCoords: string[];
	shipSize: ShipSize;
	shipRotation: ShipRotation;
	withShipCoords?: boolean;
}) => {
	const coordsAround = shipCoords
		.map((coords, index) => {
			const [parsedCoords] = parseCoords(coords);

			switch (shipSize) {
				case ShipSize.ONE:
					return getCellsCoordsAroundCell(parsedCoords, DIFF_AROUND);
				case ShipSize.TWO:
				case ShipSize.THREE:
				case ShipSize.FOUR: {
					const isHorizontalRotation = [ShipRotation.LEFT, ShipRotation.RIGHT].includes(
						shipRotation,
					);

					const diffCoords = isHorizontalRotation ? DIFF_HORIZONTAL : DIFF_VERTICAL;
					let diffCoordsIndex;
					switch (index) {
						case 0:
							diffCoordsIndex = 0;
							break;
						case shipSize - 1:
							diffCoordsIndex = DIFF_LAST_INDEX;
							break;
						default:
							diffCoordsIndex = DIFF_MIDDLE_INDEX;
							break;
					}
					const diffCoordsWithIndex = diffCoords[diffCoordsIndex];

					return getCellsCoordsAroundCell(parsedCoords, diffCoordsWithIndex);
				}
				default:
					return [];
			}
		})
		.flat();

	const allCoords = coordsAround.reduce(
		(acc, coords) => {
			if (coords) {
				const [x, y] = coords;
				const formatedCoord = formatCoords({ x, y });

				acc.push(formatedCoord);
			}

			return acc;
		},
		withShipCoords ? [...shipCoords] : [],
	);

	return allCoords;
};

export const getFormattedTableCoords = (isNeedRotate?: boolean) =>
	arrayFromDigit(TABLE_SIDE_SIZE * TABLE_SIDE_SIZE).map((index) => {
		const x = index % 10;
		const y = Math.trunc(index / 10);

		return formatCoords({ x: isNeedRotate ? y : x, y: isNeedRotate ? x : y });
	});

export const getInactiveCellCoordsForInstallWithShipRotation = ({
	shipSize,
	shipRotation,
	inactiveCoordsForInstall,
}: {
	shipSize: ShipSize;
	shipRotation: ShipRotation;
	inactiveCoordsForInstall: Set<string>;
}) => {
	const result = new Set([...inactiveCoordsForInstall]);
	let activeCoordsStreak = 0;
	const isVerticalRotation = [ShipRotation.TOP, ShipRotation.BOTTOM].includes(shipRotation);
	const tableCoords = getFormattedTableCoords(isVerticalRotation).map((coord) =>
		inactiveCoordsForInstall.has(coord) ? null : coord,
	);

	tableCoords.forEach((coords, i) => {
		const isActiveCoords = coords !== null;

		if (isActiveCoords) {
			activeCoordsStreak += 1;

			const [[x, y]] = parseCoords(coords);
			const isLastColCell = isVerticalRotation && y === LAST_TABLE_SIDE_INDEX;
			const isLastRowCell = !isVerticalRotation && x === LAST_TABLE_SIDE_INDEX;

			if (isLastColCell || isLastRowCell) {
				if (activeCoordsStreak < Number(shipSize) && activeCoordsStreak > 0) {
					const startIndex = i - activeCoordsStreak;
					const endIndex = i + 1;

					const inactiveCoords = tableCoords.slice(startIndex, endIndex);
					inactiveCoords.forEach((coord) => result.add(coord!));
				}

				activeCoordsStreak = 0;
			}
		} else {
			if (activeCoordsStreak < Number(shipSize)) {
				const startIndex = i - activeCoordsStreak;
				const endIndex = i;

				const inactiveCoords = tableCoords.slice(startIndex, endIndex);
				inactiveCoords.forEach((coord) => result.add(coord!));
			}

			activeCoordsStreak = 0;
		}
	});

	return result;
};
