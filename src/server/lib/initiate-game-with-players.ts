import { nanoid } from 'nanoid';

import { ServerIo, ServerSocket, SocketEvents } from '@/types/socket';
import { changeTurn } from './change-turn';
import { getPlayerId } from './utils';
import { ServerState } from '../server-state';

export const initiateGameWithPlayers = async (players: ServerSocket[], io: ServerIo) => {
	const roomId = nanoid();

	const isAlreadyInRoom = players.some((player) => player.rooms.size > 2);
	if (isAlreadyInRoom) {
		return;
	}

	try {
		const [player1, player2] = players;

		await player1.join(roomId);
		await player2.join(roomId);

		const [player1Id, player2Id] = players.map(getPlayerId);

		if (!player1Id || !player2Id) {
			return;
		}

		const [{ id: player1SocketId }, { id: player2SocketId }] = players;
		const [
			{ field: player1Field, ships: player1Ships },
			{ field: player2Field, ships: player2Ships },
		] = await Promise.all(
			players.map((player) => player.emitWithAck(SocketEvents.JOINED_ROOM, roomId)),
		);

		player1.data.roomId = roomId;
		player2.data.roomId = roomId;

		const player1Data = {
			enemyPlayerId: player2Id,
			socketId: player1SocketId,
			field: player1Field,
			ships: player1Ships,
			killedShips: {},
			enemyKilledShips: {},
		};

		const player2Data = {
			enemyPlayerId: player1Id,
			socketId: player2SocketId,
			field: player2Field,
			ships: player2Ships,
			killedShips: {},
			enemyKilledShips: {},
		};

		ServerState.setPlayerData({ roomId, playerId: player1Id, playerData: player1Data });
		ServerState.setPlayerData({ roomId, playerId: player2Id, playerData: player2Data });

		await changeTurn(io, roomId);

		ServerState.removeSearchingGamePlayers(players);
	} catch (e) {
		await Promise.all(players.map((player) => player.leave(roomId)));
		ServerState.deleteRoom(roomId);
		// eslint-disable-next-line no-console
		console.log((e as Error).message);
	}
};
