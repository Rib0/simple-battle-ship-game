import { ServerIo, ServerSocket, SocketEvents } from '@/types/socket';
import { findSocketBySocketId, getPlayerId } from '../lib/utils';
import { ServerState } from '../models/server-state';

export const playerLeaveGameHandler = (io: ServerIo, socket: ServerSocket) => {
	socket.on(SocketEvents.PLAYER_LEAVE_GAME, async () => {
		const { roomId } = socket.data;
		const playerId = getPlayerId(socket);

		if (!roomId || !playerId) {
			return;
		}

		const playersData = ServerState.getPlayersData({ roomId, playerId });
		if (!playersData) {
			return;
		}

		const { enemySocketId } = playersData;
		if (!enemySocketId) {
			return;
		}

		const enemyPlayerSocket = await findSocketBySocketId({ io, socketId: enemySocketId });

		if (enemyPlayerSocket) {
			enemyPlayerSocket.data = {};
		}

		socket.data = {};

		socket.to(roomId).emit(SocketEvents.PLAYER_LEAVE_GAME);
		io.socketsLeave(roomId);
		ServerState.deleteRoom(roomId);
	});
};
