import { ServerIo, ServerSocket, SocketEvents } from '@/types/socket';
import { CellType } from '@/types/game-field';
import { ROOMS } from '../constants';
import { getPlayerIdByHandshake } from '../lib/cookie';
import { changeTurn } from '../lib/socket';

export const gameActionsHandler = (io: ServerIo, socket: ServerSocket) => {
	socket.on(SocketEvents.ATTACK, (coords, roomId) => {
		if (!socket.data.turn) {
			return;
		}

		const playerId = getPlayerIdByHandshake(socket);

		const room = ROOMS[roomId];
		const { enemyPlayerId = '', socketId: playerSocketId } = room?.[playerId] || {};
		const { field: enemyField, socketId: enemySocketId } = room?.[enemyPlayerId] || {};

		if (!enemyField) {
			return;
		}

		const isDamaged = enemyField[coords] === CellType.SHIP;
		const eventType = isDamaged ? SocketEvents.DAMAGED : SocketEvents.MISSED;

		enemyField[coords] = CellType.DAMAGED;

		socket.emit(eventType, coords, false);
		socket.to(roomId).emit(eventType, coords, true);

		const players = [playerSocketId, enemySocketId].map((socketId) =>
			io.sockets.sockets.get(socketId!),
		);
		changeTurn(players as ServerSocket[]);
	});
};
