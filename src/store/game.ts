import { makeAutoObservable } from 'mobx';
import { nanoid } from 'nanoid';

import { Nullable } from '@/types/utils';
import { LocaleStorage } from '@/utils/locale-storage';

export class GameStore {
	isStarted = false;

	playerId = LocaleStorage.get('player_id_battle_ship_game');

	isEnemyOnline = false;

	isEnemyLeaveGame = false;

	invitedByPlayer: Nullable<string> = null;

	notitications: Array<{ id: string; message: string }> = [];

	constructor() {
		makeAutoObservable(this);
	}

	setGameValue = <
		T extends keyof Pick<
			GameStore,
			'isStarted' | 'playerId' | 'isEnemyOnline' | 'isEnemyLeaveGame' | 'invitedByPlayer'
		>,
	>(
		key: T,
		value: this[T],
	) => {
		this[key] = value;
	};

	addNotification = (message: string) => {
		const id = nanoid();

		this.notitications.push({ id, message });
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
}
