import { makeAutoObservable } from 'mobx';

import { ShipRotation, ShipSize } from '@/types/ship';
import { RootStore } from './root';

export class GameField {
	private store: RootStore;

	ships: Record<string, { rotation: ShipRotation; size: ShipSize }> = {};

	constructor(store: RootStore) {
		makeAutoObservable(this);

		this.store = store;
	}

	installShip({
		coords,
		rotation,
		size,
	}: {
		coords: string;
		rotation: ShipRotation;
		size: ShipSize;
	}) {
		this.ships[coords] = {
			rotation,
			size,
		};
		this.store.shipsStore.decreaseShipAmount(size);
		this.store.shipsStore.setActiveSize(null);
	}
}
