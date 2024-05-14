import { Server, Socket } from 'socket.io';
import { nanoid } from 'nanoid';

import { ROOMS, SEARCHING_GAME_PLAYERS } from '@/server/constants';
import { getPlayerId } from '@/server/lib/cookie';
import { SocketEvents } from '@/types/socket-events';
import { Field } from '@/types/game-field';

let isSearching: NodeJS.Timeout | undefined;

const tryPutPlayersToRoom = async (io: Server) => {
	isSearching = setTimeout(() => tryPutPlayersToRoom(io), 3000);

	const players = SEARCHING_GAME_PLAYERS.slice(0, 2);
	if (players.length < 2) {
		clearTimeout(isSearching);
		isSearching = undefined;
		return;
	}

	const roomId = nanoid();

	try {
		await Promise.all(players.map((player) => player.join(roomId)));

		const isAlreadyInRoom = players.some((player) => player.rooms.size > 2);
		if (isAlreadyInRoom) {
			await Promise.all(players.map((player) => player.leave(roomId)));
			return;
		}

		const [player1, player2] = players;

		const [player1Field, player2Field] = await Promise.all<Field>(
			players.map((player) => player.emitWithAck(SocketEvents.JOINED_ROOM, roomId)),
		);

		const player1Id = getPlayerId(player1);
		const player2Id = getPlayerId(player2);

		ROOMS[roomId] = {
			[player1Id]: {
				socketId: player1.id,
				field: player1Field,
			},
			[player2Id]: {
				socketId: player2.id,
				field: player2Field,
			},
		};
		SEARCHING_GAME_PLAYERS.splice(0, 2);
	} catch (e) {
		await Promise.all(players.map((player) => player.leave(roomId)));
		delete ROOMS[roomId];
		// eslint-disable-next-line no-console
		console.log((e as Error).message);
	}
};

export const searchingGameHandler = (io: Server, socket: Socket) => {
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
