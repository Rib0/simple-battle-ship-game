import { ServerIo, ServerSocket, SocketEvents } from '@/types/socket';
import { deleteRoom, findSocketBySocketId, getPlayerId, getPlayersData } from '../lib/utils';

export const playerLeaveGameHandler = (io: ServerIo, socket: ServerSocket) => {
	socket.on(SocketEvents.PLAYER_LEAVE_GAME, () => {
		const { roomId } = socket.data;
		const playerId = getPlayerId(socket);

		if (!roomId || !playerId) {
			return;
		}

		const playersData = getPlayersData({ roomId, playerId });
		if (!playersData) {
			return;
		}

		const { enemySocketId } = playersData;
		if (!enemySocketId) {
			return;
		}

		const enemyPlayerSocket = findSocketBySocketId({ io, socketId: enemySocketId });

		if (enemyPlayerSocket) {
			enemyPlayerSocket.data = {};
		}

		socket.data = {};

		socket.to(roomId).emit(SocketEvents.PLAYER_LEAVE_GAME);
		io.socketsLeave(roomId);
		deleteRoom(roomId);
	});
};
