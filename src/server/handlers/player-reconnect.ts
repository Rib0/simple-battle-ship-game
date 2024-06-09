import { GameState, ServerIo, ServerSocket, SocketEvents } from '@/types/socket';
import { Field } from '@/types/game-field';
import { ROOMS } from '../constants';
import { getPlayerIdByHandshake } from '../lib/cookie';

export const playerReconnectHandler = (io: ServerIo, socket: ServerSocket) => {
	socket.on(SocketEvents.FIND_GAME_TO_RECONNECT, async (roomId) => {
		const playerId = getPlayerIdByHandshake(socket);

		const playerData = ROOMS[roomId]?.[playerId];
		const enemyPlayerId = playerData?.enemyPlayerId;
		const enemyPlayerData = ROOMS[roomId]?.[enemyPlayerId || ''];

		if (!playerData || !enemyPlayerData) {
			return;
		}

		ROOMS[roomId] = {
			...ROOMS[roomId],
			[playerId]: {
				...playerData,
				socketId: socket.id,
			},
		};

		await socket.join(roomId);

		const playerGameState = {
			field: playerData.field,
			ships: playerData.ships,
		};

		const enemyPlayerSocket = io.sockets.sockets.get(enemyPlayerData.socketId!);

		socket.emit(
			SocketEvents.RECONNECTED_TO_ROOM,
			playerGameState as GameState,
			enemyPlayerData.field as Field,
			enemyPlayerSocket?.connected || false,
		);
		socket.to(roomId).emit(SocketEvents.ENEMY_RECONNECTED_TO_ROOM);
	});
};
