import { ServerIo, ServerSocket, SocketEvents } from '@/types/socket';
import { TURN_DURATION } from '@/constants/game';
import { Timer } from '../lib/timer';
import { getPlayerId } from '../lib/utils';
import { ServerState } from '../server-state';

export const playerDisconnectHandler = (io: ServerIo, socket: ServerSocket) => {
	socket.on('disconnect', () => {
		const { roomId } = socket.data;
		const playerId = getPlayerId(socket);

		if (!roomId || !playerId) {
			return;
		}

		const disconnectedTime = Timer.getTime;
		const { timeRemain = TURN_DURATION } =
			ServerState.getPlayersData({ roomId, playerId }) || {};
		const { turnStartTime = disconnectedTime } = ServerState.getRoomData(roomId) || {};

		const nextTimeRemain = timeRemain - (disconnectedTime - turnStartTime);

		const playerData = {
			disconnectedTime,
			timeRemain: nextTimeRemain < 0 ? 0 : nextTimeRemain,
		};

		ServerState.setPlayerData({
			roomId,
			playerId,
			playerData,
		});

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
					ServerState.deleteRoom(roomId);
				}
			}, 60);
		}
	});
};
