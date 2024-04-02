import { ShipRotation } from '@/types/ship';

export const ROTATION_MAP = {
	[ShipRotation.LEFT]: ShipRotation.TOP,
	[ShipRotation.TOP]: ShipRotation.RIGHT,
	[ShipRotation.RIGHT]: ShipRotation.BOTTOM,
	[ShipRotation.BOTTOM]: ShipRotation.LEFT,
};
