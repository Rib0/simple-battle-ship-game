import { SEARCHING_GAME_PLAYERS } from '@/server/constants';
import { ServerIo, ServerSocket, SocketEvents } from '@/types/socket';
import { initiateGameWithPlayers } from '../lib/initiate-game-with-players';

let isSearching: NodeJS.Timeout | undefined;

const tryPutPlayersToRoom = async (io: ServerIo) => {
	isSearching = setTimeout(() => tryPutPlayersToRoom(io), 3000);

	const players = SEARCHING_GAME_PLAYERS.slice(0, 2);

	if (players.length < 2) {
		clearTimeout(isSearching);
		isSearching = undefined;
		return;
	}

	await initiateGameWithPlayers(players, io);
};

export const searchingGameHandler = (io: ServerIo, socket: ServerSocket) => {
	socket.on(SocketEvents.SEARCH_GAME, async () => {
		const isPlayerSearchingGame = SEARCHING_GAME_PLAYERS.some((player) => player === socket);

		if (!isPlayerSearchingGame) {
			SEARCHING_GAME_PLAYERS.push(socket);
		}

		if (SEARCHING_GAME_PLAYERS.length >= 2 && !isSearching) {
			await tryPutPlayersToRoom(io);
		}
	});
};
