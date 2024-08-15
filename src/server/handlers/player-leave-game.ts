import { ServerIo, ServerSocket, SocketEvents } from '@/types/socket';
import { roomStore } from '../stores/rooms-store';
import { Utils } from '../lib/utils';

export const playerLeaveGameHandler = (io: ServerIo, socket: ServerSocket) => {
	socket.on(SocketEvents.PLAYER_LEAVE_GAME, () => {
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

		const { enemyPlayerId } = player;
		const enemyPlayerSocket = Utils.findSocketByPlayerId(enemyPlayerId);

		if (enemyPlayerSocket) {
			enemyPlayerSocket.data = {};
		}

		socket.data = {};

		socket.to(roomId).emit(SocketEvents.PLAYER_LEAVE_GAME);
		io.socketsLeave(roomId);
		roomStore.deleteRoom(roomId);
	});
};
