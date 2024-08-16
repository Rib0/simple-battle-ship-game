import { ServerSocket, SocketEvents } from '@/types/socket';
import { roomStore } from '../stores/rooms-store';
import { Utils } from '../lib/utils';

export const gameActionsHandler = (socket: ServerSocket) => {
	socket.on(SocketEvents.ATTACK, async (coords, roomId) => {
		const room = roomStore.getRoom(roomId);
		if (!room) {
			return;
		}

		const playerId = Utils.getPlayerId(socket);
		if (!room.isValidTurn(playerId)) {
			return;
		}

		const player = room.getPlayer(playerId);
		const enemyPlayer = room.getEnemyToPlayer(playerId);

		if (!player || !enemyPlayer) {
			return;
		}

		if (enemyPlayer.isInactiveCoords(coords)) {
			return;
		}

		const isDamaged = player.attack(enemyPlayer, coords);

		if (isDamaged) {
			room.handleGameOver();
			await room.handleDestroyedShip(coords);
		} else {
			room.changeTurn();
		}
	});
};
