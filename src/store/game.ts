import { makeAutoObservable } from 'mobx';

export class GameStore {
	isStarted = false;

	isEnemyOnline = false;

	constructor() {
		makeAutoObservable(this);
	}

	setIsStarted = (value: boolean) => {
		this.isStarted = value;
	};

	setIsEnemyOnline = (value: boolean) => {
		this.isEnemyOnline = value;
	};
}
