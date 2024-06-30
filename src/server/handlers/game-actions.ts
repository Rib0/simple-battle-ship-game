import { ServerIo, ServerSocket, SocketEvents } from '@/types/socket';
import { CellType } from '@/types/game-field';
import { ROOMS } from '../constants';
import { changeTurn } from '../lib/change-turn';
import { getPlayerId } from '../lib/handshake';

export const gameActionsHandler = (io: ServerIo, socket: ServerSocket) => {
	socket.on(SocketEvents.ATTACK, (coords, roomId) => {
		const turnPlayerId = ROOMS[roomId]?.turnPlayerId;
		const playerId = getPlayerId(socket);

		if (turnPlayerId !== playerId || !playerId) {
			return;
		}

		const room = ROOMS[roomId]?.players;
		const { enemyPlayerId = '', socketId: playerSocketId } = room?.[playerId] || {};
		const { field: enemyField, socketId: enemySocketId } = room?.[enemyPlayerId] || {};

		if (!enemyField || !playerSocketId || !enemySocketId) {
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
