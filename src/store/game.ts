import { makeAutoObservable } from 'mobx';
import { NotificationArgsProps } from 'antd';
import { nanoid } from 'nanoid';

import { LocaleStorage } from '@/utils/locale-storage';
import { TURN_DURATION } from '@/constants/game';

import { Nullable } from '@/types/utils';

export class GameStore {
	// TODO: вынести notifications и time в отдельные обьекты и включить их сюда
	isStarted = false;

	isPaused = false;

	isMyTurn = false;

	timeRemain = 0;

	playerId = LocaleStorage.get('player_id_battle_ship_game');

	isEnemyOnline = false;

	isSearching = false;

	isAwaitingInvitationResponse = false;

	invitedByPlayerId: Nullable<string> = null;

	notitications: Array<{
		id: string;
		message: string;
		onClose?: VoidFunction;
		type?: NotificationArgsProps['type'];
	}> = [];

	constructor() {
		makeAutoObservable(this);
	}

	resetStore() {
		this.isStarted = false;
		this.isPaused = false;
		this.isMyTurn = false;
		this.timeRemain = 0;
		this.playerId = LocaleStorage.get('player_id_battle_ship_game');
		this.isEnemyOnline = false;
		this.isSearching = false;
		this.isAwaitingInvitationResponse = false;
		this.invitedByPlayerId = null;
		this.notitications = [];
	}

	setGameValue = <
		T extends keyof Pick<
			GameStore,
			| 'isStarted'
			| 'isPaused'
			| 'isMyTurn'
			| 'timeRemain'
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

	addNotification = (
		{ message, type = 'info' }: { message: string; type: NotificationArgsProps['type'] },
		onClose?: VoidFunction,
	) => {
		const id = nanoid();

		this.notitications.push({ id, message, onClose, type });
	};

	get lastNotitication() {
		if (!this.notitications.length) {
			return null;
		}

		return this.notitications[this.notitications.length - 1];
	}

	removeNotitification = (id: string) => {
		const index = this.notitications.findIndex((notification) => notification.id === id);

		this.notitications.splice(index, 1);
	};

	get getTimeRemainInPercent() {
		const result = (this.timeRemain / TURN_DURATION) * 100;

		return result;
	}

	decreaseTimeRemain = () => {
		this.timeRemain -= 1;
	};
}
