import { makeAutoObservable } from 'mobx';
import { injectStores } from '@mobx-devtools/tools';

import { GameFieldStore } from './game-field';
import { ShipsStore } from './ships';

class RootStore {
	gameFieldStore: GameFieldStore;

	shipsStore: ShipsStore;

	constructor() {
		makeAutoObservable(this);

		this.gameFieldStore = new GameFieldStore(this);
		this.shipsStore = new ShipsStore(this);
	}
}

const rootStore = new RootStore();

injectStores({
	rootStore,
});

export { rootStore, RootStore };
