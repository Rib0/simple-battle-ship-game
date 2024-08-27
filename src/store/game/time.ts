import { makeAutoObservable } from 'mobx';

import { TURN_DURATION } from '@/constants/game';

export class Time {
	private timeRemain = 0;

	constructor() {
		makeAutoObservable(this);
	}

	get getTimeRemainInPercent() {
		const result = (this.timeRemain / TURN_DURATION) * 100;

		return result;
	}

	setTimeRemain = (timeRemain: number) => {
		this.timeRemain = timeRemain;
	};

	decreaseTimeRemain = () => {
		this.timeRemain -= 1;
	};
}
