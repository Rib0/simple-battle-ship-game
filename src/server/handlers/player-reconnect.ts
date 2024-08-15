import { ServerSocket, SocketEvents } from '@/types/socket';
import { Utils } from '../lib/utils';
import { roomStore } from '../stores/rooms-store';

export const playerReconnectHandler = (socket: ServerSocket) => {
	socket.on(SocketEvents.FIND_GAME_TO_RECONNECT, async (roomId) => {
		const room = roomStore.getRoom(roomId);
		if (!room) {
			return;
		}

		const playerId = Utils.getPlayerId(socket);
		if (!playerId) {
			return;
		}

		const player = room.getPlayer(playerId);
		if (!player) {
			return;
		}

		player.socketId = socket.id;

		const enemyPlayer = room.getEnemyToPlayer(playerId);
		if (!enemyPlayer) {
			return;
		}

		socket.data.roomId = roomId;
		await socket.join(roomId);

		const { field, ships, killedShipsInitialCoords, enemyKilledShips } = player;
		const playerGameState = {
			field,
			ships,
			killedShipsInitialCoords,
			enemyKilledShips,
		};
		const enemyPlayerSocket = Utils.findSocketBySocketId(enemyPlayer.socketId);
		const isEnemyPlayerSocketConnected = enemyPlayerSocket?.connected || false;

		socket.to(roomId).emit(SocketEvents.ENEMY_RECONNECTED_TO_ROOM);
		socket.emit(
			SocketEvents.RECONNECTED_TO_ROOM,
			playerGameState,
			enemyPlayer.field,
			isEnemyPlayerSocketConnected,
		);

		room.changeTurn(playerId);
	});
};
