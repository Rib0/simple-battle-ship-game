import { GameState, ServerIo, ServerSocket, SocketEvents } from '@/types/socket';
import { Field } from '@/types/game-field';
import { ROOMS } from '../constants';
import { getPlayerId } from '../lib/handshake';
import { changeTurn } from '../lib/change-turn';

export const playerReconnectHandler = (io: ServerIo, socket: ServerSocket) => {
	socket.on(SocketEvents.FIND_GAME_TO_RECONNECT, async (roomId) => {
		const playerId = getPlayerId(socket);

		if (!playerId) {
			return;
		}

		const playerData = ROOMS[roomId]?.players?.[playerId];
		const enemyPlayerId = playerData?.enemyPlayerId;
		const enemyPlayerData = ROOMS[roomId]?.players?.[enemyPlayerId || ''];

		if (!playerData || !enemyPlayerData || !enemyPlayerData.socketId) {
			return;
		}

		const isAllPlayerConnected = [playerData.socketId, enemyPlayerData.socketId].every((id) => {
			if (!id) {
				return false;
			}

			return io.sockets.sockets.get(id)?.connected;
		});

		if (isAllPlayerConnected) {
			return;
		}

		socket.data.roomId = roomId;
		ROOMS[roomId] = {
			...ROOMS[roomId],
			players: {
				...ROOMS[roomId]?.players,
				[playerId]: {
					...playerData,
					socketId: socket.id,
				},
			},
		};

		await socket.join(roomId);

		const playerGameState = {
			field: playerData.field,
			ships: playerData.ships,
		};

		const enemyPlayerSocket = io.sockets.sockets.get(enemyPlayerData.socketId);

		socket.emit(
			SocketEvents.RECONNECTED_TO_ROOM,
			playerGameState as GameState,
			enemyPlayerData.field as Field,
			enemyPlayerSocket?.connected || false,
		);
		socket.to(roomId).emit(SocketEvents.ENEMY_RECONNECTED_TO_ROOM);
		changeTurn(io, roomId, playerId);
	});
};
