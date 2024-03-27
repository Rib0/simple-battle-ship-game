import { makeAutoObservable } from 'mobx';

import { ShipRotation, ShipSize } from '@/types/ship';
import { Nullable } from '@/types/utils';

export class ShipsStore {
	private activeSize: Nullable<ShipSize> = null;

	private rotationMap = {
		[ShipRotation.LEFT]: ShipRotation.TOP,
		[ShipRotation.TOP]: ShipRotation.RIGHT,
		[ShipRotation.RIGHT]: ShipRotation.BOTTOM,
		[ShipRotation.BOTTOM]: ShipRotation.LEFT,
	};

	activeShipRotation = ShipRotation.LEFT;

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
		if (size === null) {
			this.activeShipRotation = ShipRotation.LEFT;
		}

		this.activeSize = size;
	};

	get getActiveSize() {
		return this.activeSize;
	}

	decreaseShipAmount = (shipSize: ShipSize) => {
		let result = this.shipsAmount[shipSize] - 1;

		result = result >= 0 ? result : 0;

		this.shipsAmount[shipSize] = result;
	};

	rotateActiveShip = () => {
		this.activeShipRotation = this.rotationMap[this.activeShipRotation];
	};
}
