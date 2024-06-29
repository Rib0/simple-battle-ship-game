import { makeAutoObservable } from 'mobx';
import { injectStores } from '@mobx-devtools/tools';

import { GameFieldStore } from './game-field';
import { ShipsStore } from './ships';
import { GameStore } from './game';

class RootStore {
	gameFieldStore: GameFieldStore;

	shipsStore: ShipsStore;

	gameStore: GameStore;

	constructor() {
		makeAutoObservable(this);

		this.gameFieldStore = new GameFieldStore(this);
		this.shipsStore = new ShipsStore(this);
		this.gameStore = new GameStore();
	}

	createNewStoreData = () => {
		this.gameFieldStore = new GameFieldStore(this);
		this.shipsStore = new ShipsStore(this);
		this.gameStore = new GameStore();
	};
}

const rootStore = new RootStore();

injectStores({
	rootStore,
});

export { rootStore, RootStore };
