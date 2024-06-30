import { ServerIo, ServerSocket, SocketEvents } from '@/types/socket';
import { Timer } from '../lib/timer';
import { ROOMS } from '../constants';
import { getPlayerId } from '../lib/handshake';

export const playerDisconnectHandler = (io: ServerIo, socket: ServerSocket) => {
	socket.on('disconnect', () => {
		const { roomId } = socket.data;

		if (!roomId) {
			return;
		}

		const playerId = getPlayerId(socket);

		if (!playerId) {
			return;
		}

		const playerData = ROOMS[roomId]?.players?.[playerId] || {};
		playerData.disconnectedTime = Timer.getTime;

		socket.to(roomId).emit(SocketEvents.ENEMY_DISCONNECTED);

		const { rooms } = io.of('/').adapter;
		const roomSocketSize = rooms.get(roomId)?.size;

		if (!roomSocketSize) {
			Timer.addCallback(() => {
				const { rooms: actualRooms } = io.of('/').adapter;
				const actualRoomSocketSize = actualRooms.get(roomId)?.size;

				if (!actualRoomSocketSize) {
					socket.to(roomId).emit(SocketEvents.PLAYER_LEAVE_GAME);
					io.socketsLeave(roomId);
					delete ROOMS[roomId];
				}
			}, 60_000);
		}
	});
};
