import { ServerIo, ServerSocket, SocketEvents } from '@/types/socket';
import { ServerState } from '../models/server-state';

let isSearching: NodeJS.Timeout | undefined;

export const searchingGameHandler = (io: ServerIo, socket: ServerSocket) => {
	socket.on(SocketEvents.SEARCH_GAME, async () => {
		if (socket.data.invitedPlayerId) {
			return;
		}

		const isPlayerSearchingGame = ServerState.getSearchingGamePlayerSocket(socket);

		if (!isPlayerSearchingGame) {
			ServerState.addSeachingGamePlayer(socket);
		}

		if (ServerState.getPlayersForGame.length >= 2 && !isSearching) {
			await ServerState.tryPutPlayersToRoom(io);
		}
	});

	socket.on(SocketEvents.CANCEL_SEARCH_GAME, () => {
		ServerState.removeSearchingGamePlayers([socket]);
	});
};
