import { nanoid } from 'nanoid';

import { ROOMS, SEARCHING_GAME_PLAYERS } from '@/server/constants';
import { getPlayerIdByHandshake } from '@/server/lib/cookie';
import { ServerIo, ServerSocket, SocketEvents } from '@/types/socket';
import { changeTurn } from './change-turn';

export const initiateGameWithPlayers = async (players: ServerSocket[], io: ServerIo) => {
	const roomId = nanoid();

	try {
		await Promise.all(players.map((player) => player.join(roomId)));

		const isAlreadyInRoom = players.some((player) => player.rooms.size > 2);
		if (isAlreadyInRoom) {
			io.socketsLeave(roomId);
			return;
		}

		const [player1Id, player2Id] = players.map(getPlayerIdByHandshake);
		const [{ id: player1SocketId }, { id: player2SocketId }] = players;
		const [
			{ field: player1Field, ships: player1Ships },
			{ field: player2Field, ships: player2Ships },
		] = await Promise.all(
			players.map((player) => player.emitWithAck(SocketEvents.JOINED_ROOM, roomId)),
		);
		players.forEach((player) => {
			player.data.roomId = roomId;
		});

		ROOMS[roomId] = {
			[player1Id]: {
				enemyPlayerId: player2Id,
				socketId: player1SocketId,
				field: player1Field,
				ships: player1Ships,
			},
			[player2Id]: {
				enemyPlayerId: player1Id,
				socketId: player2SocketId,
				field: player2Field,
				ships: player2Ships,
			},
		};
		changeTurn(players);
		SEARCHING_GAME_PLAYERS.splice(0, 2);
	} catch (e) {
		await Promise.all(players.map((player) => player.leave(roomId)));
		delete ROOMS[roomId];
		// eslint-disable-next-line no-console
		console.log((e as Error).message);
	}
};
