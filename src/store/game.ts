import { Nullable } from '@/types/utils';
import { makeAutoObservable } from 'mobx';

export class GameStore {
	isStarted = false;

	isEnemyOnline = false;

	invitedByPlayer: Nullable<string> = null;

	constructor() {
		makeAutoObservable(this);
	}

	setIsStarted = (value: boolean) => {
		this.isStarted = value;
	};

	setIsEnemyOnline = (value: boolean) => {
		this.isEnemyOnline = value;
	};

	setInvitedByPlayer = (value: Nullable<string>) => {
		this.invitedByPlayer = value;
	};
}
