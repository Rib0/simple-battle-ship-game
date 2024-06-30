import { ServerIo, ServerSocket, SocketEvents } from '@/types/socket';
import { ROOMS } from '../constants';
import { getPlayerId } from '../lib/handshake';

export const playerLeaveGameHandler = (io: ServerIo, socket: ServerSocket) => {
	socket.on(SocketEvents.PLAYER_LEAVE_GAME, () => {
		const playerId = getPlayerId(socket);
		const { roomId } = socket.data;

		if (!roomId || !playerId) {
			return;
		}

		const playerData = ROOMS[roomId]?.players?.[playerId];
		const enemyPlayerId = playerData?.enemyPlayerId;
		const enemyPlayerData = ROOMS[roomId]?.players?.[enemyPlayerId || ''];

		const sockets = Array.from(io.sockets.sockets.values());

		const enemyPlayerSocket = sockets.find(
			(playerSocket) => enemyPlayerData?.socketId === playerSocket.id,
		);

		if (enemyPlayerSocket) {
			enemyPlayerSocket.data = {};
		}

		socket.data = {};

		socket.to(roomId).emit(SocketEvents.PLAYER_LEAVE_GAME);
		io.socketsLeave(roomId);
		delete ROOMS[roomId];
	});
};
