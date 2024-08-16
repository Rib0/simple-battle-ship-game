import { ServerIo, ServerSocket, SocketEvents } from '@/types/socket';
import { TURN_DURATION } from '@/constants/game';
import { Timer } from '../lib/timer';
import { Utils } from '../lib/utils';
import { roomStore } from '../stores/rooms-store';
import { appStore } from '../stores/app-store';

export const playerDisconnectHandler = (io: ServerIo, socket: ServerSocket) => {
	socket.on('disconnect', () => {
		appStore.removeSearchingGamePlayersIds([socket]);

		const { roomId } = socket.data;
		if (!roomId) {
			return;
		}

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
		const { turnStartTime = disconnectedTime, timeRemain = TURN_DURATION } = room;
		const nextTimeRemain = timeRemain - (disconnectedTime - turnStartTime);

		room.timeRemain = nextTimeRemain < 0 ? 0 : nextTimeRemain;
		player.disconnectedTime = disconnectedTime;

		socket.to(roomId).emit(SocketEvents.ENEMY_DISCONNECTED);

		const rooms = Utils.getAllRooms;
		const roomSocketSize = rooms.get(roomId)?.size;

		if (!roomSocketSize) {
			Timer.addCallback(() => {
				const actualRooms = Utils.getAllRooms;
				const actualRoomSocketSize = actualRooms.get(roomId)?.size;

				if (!actualRoomSocketSize) {
					io.to(roomId).emit(SocketEvents.PLAYER_LEAVE_GAME);
					io.socketsLeave(roomId);
					roomStore.deleteRoom(roomId);

					const { enemyPlayerId } = player;
					const enemyPlayerSocket = Utils.findSocketByPlayerId(enemyPlayerId);

					if (enemyPlayerSocket) {
						enemyPlayerSocket.data = {};
					}

					socket.data = {};
				}
			}, 60);
		}
	});
};
