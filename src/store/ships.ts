import { makeAutoObservable } from 'mobx';

import { ShipRotation, ShipSize } from '@/types/ship';
import { Nullable } from '@/types/utils';
import { ROTATION_MAP } from '@/constants';

export class ShipsStore {
	activeSize: Nullable<ShipSize> = null;

	activeSizeRotation = ShipRotation.LEFT;

	shipsAmount: Record<ShipSize, number> = {
		[ShipSize.ONE]: 4,
		[ShipSize.TWO]: 3,
		[ShipSize.THREE]: 2,
		[ShipSize.FOUR]: 1,
	};

	constructor() {
		makeAutoObservable(this);
	}

	setActiveSize = (size: Nullable<ShipSize>) => {
		this.activeSizeRotation = ShipRotation.LEFT;

		this.activeSize = size;
	};

	decreaseShipAmount = (shipSize: ShipSize) => {
		this.shipsAmount[shipSize] -= 1;
	};

	increaseShipAmount = (shipSize: ShipSize) => {
		this.shipsAmount[shipSize] += 1;
	};

	rotateActiveShip = () => {
		this.activeSizeRotation = ROTATION_MAP[this.activeSizeRotation];
	};
}
