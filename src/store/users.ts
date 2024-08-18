import { makeAutoObservable } from 'mobx';
import { UserOnlineFromServer, UsersOnline } from '@/types/socket';
import { RootStore } from './root';

export class UsersStore {
	private store: RootStore;

	list: UsersOnline['users'] = new Map();

	inGameAmount: UsersOnline['inGameAmount'] = 0;

	constructor(store: RootStore) {
		makeAutoObservable(this);

		this.store = store;
	}

	get getAllUsers() {
		const users = [...this.list.values()];
		const { playerId } = this.store.gameStore;

		users.sort((a, b) => {
			switch (playerId) {
				case a.playerId:
					return -1;
				case b.playerId:
					return 1;
				default:
					if (a.isInGame) {
						return -1;
					}
					if (b.isInGame) {
						return 1;
					}
			}

			return 0;
		});

		return users;
	}

	setUsers(data: UserOnlineFromServer) {
		const { users, inGameAmount } = data;

		this.list = new Map(Object.entries(users));
		this.inGameAmount = inGameAmount;
	}

	addUser(playerId: string, isInGame?: boolean) {
		const existedUser = this.list.get(playerId);

		this.list.set(playerId, { playerId, isInGame: !!isInGame });

		if (existedUser) {
			if (existedUser.isInGame && !isInGame) {
				this.inGameAmount -= 1;
				return;
			}
			if (!existedUser.isInGame && isInGame) {
				this.inGameAmount += 1;
			}
		} else if (isInGame) {
			this.inGameAmount += 1;
		}
	}

	removeUser(playerId: string) {
		const isInGame = this.list.get(playerId)?.isInGame;
		const isDeleted = this.list.delete(playerId);

		if (isDeleted && isInGame) {
			this.inGameAmount -= 1;
		}
	}
}
