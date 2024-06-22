import { Nullable } from '@/types/utils';
import { LocaleStorage } from '@/utils/locale-storage';
import { makeAutoObservable } from 'mobx';

export class GameStore {
	isStarted = false;

	playerId = LocaleStorage.get('player_id_battle_ship_game');

	isEnemyOnline = false;

	invitedByPlayer: Nullable<string> = null;

	constructor() {
		makeAutoObservable(this);
	}

	setIsStarted = (value: boolean) => {
		this.isStarted = value;
	};

	setPlayerId = (value: string) => {
		this.playerId = value;
	};

	setIsEnemyOnline = (value: boolean) => {
		this.isEnemyOnline = value;
	};

	setInvitedByPlayer = (value: Nullable<string>) => {
		this.invitedByPlayer = value;
	};
}
