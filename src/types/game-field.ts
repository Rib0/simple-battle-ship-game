import { ShipRotation, ShipSize } from './ship';

export type Coords = { x: number; y: number };

export type GameFieldShips = Record<string, { rotation: ShipRotation; size: ShipSize }>;

export enum CellType {
	SHIP = 'SHIP',
	BOMB = 'BOMB',
	DAMAGED = 'DAMAGED',
}
export type Field = Record<string, CellType>;
