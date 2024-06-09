import { ServerIo, ServerSocket, SocketEvents } from '@/types/socket';
import { Timer } from '../lib/timer';
import { ROOMS } from '../constants';

export const playerDisconnectHandler = (io: ServerIo, socket: ServerSocket) => {
	socket.on('disconnect', () => {
		const { roomId } = socket.data;

		socket.to(roomId).emit(SocketEvents.ENEMY_DISCONNECTED);

		const { rooms } = io.of('/').adapter;
		const roomSocketSize = rooms.get(roomId)?.size;

		if (!roomSocketSize) {
			Timer.addCallback(() => {
				const { rooms: actualRooms } = io.of('/').adapter;
				const actualRoomSocketSize = actualRooms.get(roomId)?.size;

				if (!actualRoomSocketSize) {
					delete ROOMS[roomId];
				}
			}, 60_000);
		}
	});
};
