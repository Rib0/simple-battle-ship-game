import { ServerSocket, SocketEvents } from '@/types/socket';
import { roomStore } from './rooms-store';

class AppStore {
	private searchingGamePlayers: Set<ServerSocket> = new Set();

	private hasUsersSearchingForGame?: NodeJS.Timeout = undefined;

	removeSearchingGamePlayers(sockets: ServerSocket[]) {
		sockets.forEach((socket) => this.searchingGamePlayers.delete(socket));
	}

	addSearchingGamePlayer(socket: ServerSocket) {
		const isAlreadySearching = this.searchingGamePlayers.has(socket);

		if (socket.data.invitedPlayerId || isAlreadySearching) {
			return;
		}

		this.searchingGamePlayers.add(socket);

		if (!this.hasUsersSearchingForGame) {
			// eslint-disable-next-line @typescript-eslint/no-floating-promises
			this.tryInitiateGame();
		}
	}

	private get getPlayersForGame() {
		const players = [...this.searchingGamePlayers].slice(0, 2);

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
			this.removeSearchingGamePlayers(players);
		} catch {
			players.forEach((player) =>
				player.emit(SocketEvents.ERROR, 'Ошибка при подключении к игре'),
			);
		}
	}
}

const appStore = new AppStore();

export { appStore };
