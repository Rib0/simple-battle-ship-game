import { ServerIo, ServerSocket, SocketEvents } from '@/types/socket';
import { CellType } from '@/types/game-field';
import { changeTurn } from '../lib/change-turn';
import { getPlayerId, getPlayersData, getTurnPlayerId } from '../lib/utils';

export const gameActionsHandler = (io: ServerIo, socket: ServerSocket) => {
	socket.on(SocketEvents.ATTACK, (coords, roomId) => {
		const turnPlayerId = getTurnPlayerId(roomId);
		const playerId = getPlayerId(socket);

		if (turnPlayerId !== playerId || !playerId) {
			return;
		}

		const playersData = getPlayersData({ roomId, playerId });
		if (!playersData) {
			return;
		}

		const { socketId, enemySocketId, enemyField } = playersData;

		if (!enemyField || !socketId || !enemySocketId) {
			return;
		}

		if ([CellType.BOMB, CellType.DAMAGED].includes(enemyField[coords] as CellType)) {
			return;
		}

		const isDamaged = enemyField[coords] === CellType.SHIP;
		const eventType = isDamaged ? SocketEvents.DAMAGED : SocketEvents.MISSED;

		enemyField[coords] = isDamaged ? CellType.DAMAGED : CellType.BOMB;

		socket.emit(eventType, coords, false);
		socket.to(roomId).emit(eventType, coords, true);

		if (!isDamaged) {
			changeTurn(io, roomId);
		}
	});
};
