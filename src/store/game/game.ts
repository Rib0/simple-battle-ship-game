import { makeAutoObservable } from 'mobx';

import { LocaleStorage } from '@/utils/locale-storage';

import { Nullable } from '@/types/utils';
import { Notifications } from './notitications';
import { Time } from './time';

export class GameStore {
	isStarted = false;

	isPaused = false;

	isMyTurn = false;

	playerId = LocaleStorage.get('player_id_battle_ship_game');

	isEnemyOnline = false;

	isSearching = false;

	isAwaitingInvitationResponse = false;

	invitedByPlayerId: Nullable<string> = null;

	notitications = new Notifications();

	time = new Time();

	constructor() {
		makeAutoObservable(this);
	}

	resetStore() {
		this.isStarted = false;
		this.isPaused = false;
		this.isMyTurn = false;
		this.playerId = LocaleStorage.get('player_id_battle_ship_game');
		this.isEnemyOnline = false;
		this.isSearching = false;
		this.isAwaitingInvitationResponse = false;
		this.invitedByPlayerId = null;
		this.notitications = new Notifications();
		this.time = new Time();
	}

	setGameValue = <
		T extends keyof Pick<
			GameStore,
			| 'isStarted'
			| 'isPaused'
			| 'isMyTurn'
			| 'playerId'
			| 'isEnemyOnline'
			| 'isSearching'
			| 'isAwaitingInvitationResponse'
			| 'invitedByPlayerId'
		>,
	>(
		key: T,
		value: this[T],
	) => {
		this[key] = value;
	};
}
