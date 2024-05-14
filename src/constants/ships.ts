import { ShipSize, ShipRotation } from '@/types/ship';

export const SHIPS_AMOUNT = {
	[ShipSize.ONE]: 4,
	[ShipSize.TWO]: 3,
	[ShipSize.THREE]: 2,
	[ShipSize.FOUR]: 1,
};

export const SHIP_ROTATION_MAP = {
	[ShipRotation.LEFT]: ShipRotation.TOP,
	[ShipRotation.TOP]: ShipRotation.RIGHT,
	[ShipRotation.RIGHT]: ShipRotation.BOTTOM,
	[ShipRotation.BOTTOM]: ShipRotation.LEFT,
};
