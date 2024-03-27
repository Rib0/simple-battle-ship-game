import { makeAutoObservable } from 'mobx';
import { ShipsStore } from './ships';
import { GameField } from './game-field';

class RootStore {
	gameFieldStore: GameField;

	shipsStore: ShipsStore;

	constructor() {
		makeAutoObservable(this);

		this.gameFieldStore = new GameField(this);
		this.shipsStore = new ShipsStore();
	}
}

const rootStore = new RootStore();

export { rootStore, RootStore };
