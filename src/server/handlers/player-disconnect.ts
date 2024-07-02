import { ServerIo, ServerSocket, SocketEvents } from '@/types/socket';
import { Timer } from '../lib/timer';
import { ROOMS } from '../constants';
import { getPlayerId, setPlayerData } from '../lib/get-data';

export const playerDisconnectHandler = (io: ServerIo, socket: ServerSocket) => {
	socket.on('disconnect', () => {
		const { roomId } = socket.data;
		const playerId = getPlayerId(socket);

		if (!roomId || !playerId) {
			return;
		}

		const playerData = { disconnectedTime: Timer.getTime };
		setPlayerData({ roomId, playerId, playerData });

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
