import { makeAutoObservable } from 'mobx';
import { nanoid } from 'nanoid';

import { LocaleStorage } from '@/utils/locale-storage';
import { TURN_DURATION } from '@/constants/game';

import { Nullable } from '@/types/utils';

export class GameStore {
	isStarted = false;

	isMyTurn = false;

	turnStartTime = 0;

	currentTime = 0;

	playerId = LocaleStorage.get('player_id_battle_ship_game');

	isEnemyOnline = false;

	invitedByPlayer: Nullable<string> = null;

	notitications: Array<{ id: string; message: string; onClose?: VoidFunction }> = [];

	constructor() {
		makeAutoObservable(this);
	}

	setGameValue = <
		T extends keyof Pick<
			GameStore,
			| 'isStarted'
			| 'isMyTurn'
			| 'turnStartTime'
			| 'currentTime'
			| 'playerId'
			| 'isEnemyOnline'
			| 'invitedByPlayer'
		>,
	>(
		key: T,
		value: this[T],
	) => {
		this[key] = value;
	};

	addNotification = (message: string, onClose?: VoidFunction) => {
		const id = nanoid();

		this.notitications.push({ id, message, onClose });
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

	get getDiffTurnStartTimeInPercent() {
		const diffTime = this.currentTime - this.turnStartTime;
		const timeRemain = TURN_DURATION - diffTime;

		const result = (timeRemain / TURN_DURATION) * 100;

		return result;
	}
}
