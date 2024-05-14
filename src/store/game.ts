import { makeAutoObservable } from 'mobx';

export class GameStore {
	isStarted = false;

	constructor() {
		makeAutoObservable(this);
	}

	setIsStarted = (value: boolean) => {
		this.isStarted = value;
	};
}
