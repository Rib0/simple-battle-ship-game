import { makeAutoObservable } from 'mobx';

import { ShipRotation, ShipSize } from '@/types/ship';
import { Nullable } from '@/types/utils';
import { ROTATION_MAP } from '@/constants';
import { getArrayOfShipsAmount, getShipsAmount } from '@/utils/ship';
import { RootStore } from './root';

export class ShipsStore {
	private store: RootStore;

	activeSize: Nullable<ShipSize> = null;

	activeSizeRotation = ShipRotation.LEFT;

	shipsAmount = getShipsAmount();

	constructor(store: RootStore) {
		makeAutoObservable(this);

		this.store = store;
	}

	setActiveSize = (size: Nullable<ShipSize>) => {
		this.store.gameFieldStore.setActiveInstalledShip(null);
		this.activeSizeRotation = ShipRotation.LEFT;

		this.activeSize = size;
	};

	resetShipAmount = () => {
		this.shipsAmount = getShipsAmount();
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

	get isAllShipsInstalled() {
		return Boolean(getArrayOfShipsAmount(this.shipsAmount).length === 0);
	}
}
