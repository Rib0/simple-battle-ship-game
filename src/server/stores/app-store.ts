import { ServerSocket, SocketEvents } from '@/types/socket';
import { roomStore } from './rooms-store';
import { Utils } from '../lib/utils';

class AppStore {
	private searchingGamePlayersIds: Set<string> = new Set();

	private hasUsersSearchingForGame?: NodeJS.Timeout = undefined;

	removeSearchingGamePlayersIds(sockets: ServerSocket[]) {
		sockets.forEach((socket) => {
			const playerId = Utils.getPlayerId(socket);

			if (playerId) {
				this.searchingGamePlayersIds.delete(playerId);
			}
		});
	}

	addSearchingGamePlayerId(socket: ServerSocket) {
		const playerId = Utils.getPlayerId(socket);

		if (!playerId) {
			return;
		}

		const isAlreadySearching = this.searchingGamePlayersIds.has(playerId);

		if (isAlreadySearching) {
			return;
		}

		this.searchingGamePlayersIds.add(playerId);

		if (!this.hasUsersSearchingForGame) {
			// eslint-disable-next-line @typescript-eslint/no-floating-promises
			this.tryInitiateGame();
		}
	}

	private get getPlayersForGame() {
		const playersId = [...this.searchingGamePlayersIds].slice(0, 2);
		const players = playersId
			.map((playerId) => Utils.findSocketByPlayerId(playerId))
			.filter((player): player is ServerSocket => Boolean(player));

		return players;
	}

	private async tryInitiateGame() {
		const players = this.getPlayersForGame;

		if (players.length < 2 || this.hasUsersSearchingForGame) {
			clearTimeout(this.hasUsersSearchingForGame);
			this.hasUsersSearchingForGame = undefined;
			return;
		}

		this.hasUsersSearchingForGame = setTimeout(this.tryInitiateGame.bind(this), 3000);

		try {
			await roomStore.createRoomWithPlayers(players);
		} catch {
			players.forEach((player) =>
				player.emit(SocketEvents.ERROR, 'Ошибка при подключении к игре'),
			);
		}
	}
}

const appStore = new AppStore();

export { appStore };
