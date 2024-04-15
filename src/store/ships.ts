import { makeAutoObservable } from 'mobx';

import { ShipRotation, ShipSize } from '@/types/ship';
import { Nullable } from '@/types/utils';
import { ROTATION_MAP } from '@/constants';
import { RootStore } from './root';

export class ShipsStore {
	private store: RootStore;

	activeSize: Nullable<ShipSize> = null;

	activeSizeRotation = ShipRotation.LEFT;

	shipsAmount: Record<ShipSize, number> = {
		[ShipSize.ONE]: 4,
		[ShipSize.TWO]: 3,
		[ShipSize.THREE]: 2,
		[ShipSize.FOUR]: 1,
	};

	constructor(store: RootStore) {
		makeAutoObservable(this);

		this.store = store;
	}

	setActiveSize = (size: Nullable<ShipSize>) => {
		this.activeSizeRotation = ShipRotation.LEFT;

		this.activeSize = size;
		this.store.gameFieldStore.setActiveInstalledShip(null);
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
