import { makeAutoObservable } from 'mobx';

import { ShipRotation, ShipSize } from '@/types/ship';
import { Nullable } from '@/types/utils';
import { SHIP_ROTATION_MAP } from '@/constants/ships';
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

	resetStore() {
		this.activeSize = null;
		this.activeSizeRotation = ShipRotation.LEFT;
		this.shipsAmount = getShipsAmount();
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
		this.activeSizeRotation = SHIP_ROTATION_MAP[this.activeSizeRotation];
	};

	get isAllShipsInstalled() {
		return Boolean(getArrayOfShipsAmount(this.shipsAmount).length === 0);
	}
}
