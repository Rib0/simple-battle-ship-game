import { ServerIo, ServerSocket, SocketEvents } from '@/types/socket';
import { TURN_DURATION } from '@/constants/game';
import { Timer } from '../lib/timer';
import { Utils } from '../lib/utils';
import { roomStore } from '../stores/rooms-store';
import { appStore } from '../stores/app-store';

export const playerDisconnectHandler = (io: ServerIo, socket: ServerSocket) => {
	socket.on('disconnect', () => {
		const { roomId } = socket.data;
		if (!roomId) {
			return;
		}

		appStore.removeSearchingGamePlayers([socket]);

		const room = roomStore.getRoom(roomId);
		const playerId = Utils.getPlayerId(socket);

		if (!room || !playerId) {
			return;
		}

		const player = room.getPlayer(playerId);

		if (!player) {
			return;
		}

		const disconnectedTime = Timer.getTime;
		const { timeRemain = TURN_DURATION } = player;
		const { turnStartTime = disconnectedTime } = room;
		const nextTimeRemain = timeRemain - (disconnectedTime - turnStartTime);

		player.disconnectedTime = disconnectedTime;
		player.timeRemain = nextTimeRemain < 0 ? 0 : nextTimeRemain;

		socket.to(roomId).emit(SocketEvents.ENEMY_DISCONNECTED);

		const rooms = Utils.getAllRooms;
		const roomSocketSize = rooms.get(roomId)?.size;

		if (!roomSocketSize) {
			Timer.addCallback(() => {
				const actualRooms = Utils.getAllRooms;
				const actualRoomSocketSize = actualRooms.get(roomId)?.size;

				const { enemyPlayerId } = player;
				const enemyPlayerSocket = Utils.findSocketByPlayerId(enemyPlayerId);

				if (enemyPlayerSocket) {
					enemyPlayerSocket.data = {};
				}

				socket.data = {};

				if (!actualRoomSocketSize) {
					io.to(roomId).emit(SocketEvents.PLAYER_LEAVE_GAME);
					io.socketsLeave(roomId);
					roomStore.deleteRoom(roomId);
				}
			}, 60);
		}
	});
};
