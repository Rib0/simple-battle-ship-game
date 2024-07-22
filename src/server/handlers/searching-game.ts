import { ServerIo, ServerSocket, SocketEvents } from '@/types/socket';
import { ServerState } from '../server-state';

let isSearching: NodeJS.Timeout | undefined;

export const searchingGameHandler = (io: ServerIo, socket: ServerSocket) => {
	socket.on(SocketEvents.SEARCH_GAME, async () => {
		const isPlayerSearchingGame = ServerState.getSearchingGamePlayerSocket(socket);

		if (!isPlayerSearchingGame) {
			ServerState.addSeachingGamePlayer(socket);
		}

		if (ServerState.getPlayersForGame.length >= 2 && !isSearching) {
			await ServerState.tryPutPlayersToRoom(io);
		}
	});
};
