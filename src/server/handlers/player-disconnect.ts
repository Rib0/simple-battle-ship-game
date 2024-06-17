import { ServerIo, ServerSocket, SocketEvents } from '@/types/socket';
import { Timer } from '../lib/timer';
import { ROOMS } from '../constants';

export const playerDisconnectHandler = (io: ServerIo, socket: ServerSocket) => {
	socket.on('disconnect', () => {
		const { roomId } = socket.data;

		if (!roomId) {
			// TODO: продумать это, мб переустанавливать socket.data.roomId при reconnect игрока
			return;
		}

		socket.to(roomId).emit(SocketEvents.ENEMY_DISCONNECTED);

		const { rooms } = io.of('/').adapter;
		const roomSocketSize = rooms.get(roomId)?.size;

		if (!roomSocketSize) {
			Timer.addCallback(() => {
				const { rooms: actualRooms } = io.of('/').adapter;
				const actualRoomSocketSize = actualRooms.get(roomId)?.size;

				if (!actualRoomSocketSize) {
					delete ROOMS[roomId];
					// Отправлять перед этим в комнату сообщение всем имеющимся участникам, что противник покинул игру io.socketsLeave("roomId");
				}
			}, 60_000);
		}
	});
};
