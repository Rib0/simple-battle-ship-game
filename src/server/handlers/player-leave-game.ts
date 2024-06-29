import { ServerIo, ServerSocket, SocketEvents } from '@/types/socket';

export const playerLeaveGameHandler = (io: ServerIo, socket: ServerSocket) => {
	socket.on(SocketEvents.PLAYER_LEAVE_GAME, () => {
		const { playerId, roomId } = socket.data;

		socket.data = {
			playerId,
		};

		if (!roomId) {
			return;
		}

		socket.to(roomId).emit(SocketEvents.PLAYER_LEAVE_GAME);
	});
};
