import { makeAutoObservable } from 'mobx';
import { injectStores } from '@mobx-devtools/tools';

import { GameFieldStore } from './game-field';
import { ShipsStore } from './ships';
import { GameStore } from './game/game';
import { UsersStore } from './users';

class RootStore {
	gameFieldStore: GameFieldStore;

	shipsStore: ShipsStore;

	gameStore: GameStore;

	usersStore: UsersStore;

	constructor() {
		makeAutoObservable(this);

		this.gameFieldStore = new GameFieldStore(this);
		this.shipsStore = new ShipsStore(this);
		this.gameStore = new GameStore();
		this.usersStore = new UsersStore(this);
	}

	resetAllGameStores = () => {
		this.gameFieldStore.resetStore();
		this.shipsStore.resetStore();
		this.gameStore.resetStore();
	};
}

const rootStore = new RootStore();

injectStores({
	rootStore,
});

export { rootStore, RootStore };
