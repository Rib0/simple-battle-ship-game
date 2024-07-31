import { ServerIo, ServerSocket, SocketEvents } from '@/types/socket';
import { CellType, Field, GameFieldShips } from '@/types/game-field';
import { changeTurn } from '../lib/change-turn';
import { handleDestroyedShip } from '../lib/handle-destroyed-ship';
import { findSocketBySocketId, getPlayerId } from '../lib/utils';
import { checkIsGameOver } from '../lib/check-is-game-over';
import { ServerState } from '../server-state';

export const gameActionsHandler = (io: ServerIo, socket: ServerSocket) => {
	socket.on(SocketEvents.ATTACK, async (coords, roomId) => {
		const turnPlayerId = ServerState.getTurnPlayerId(roomId);
		const playerId = getPlayerId(socket);

		if (turnPlayerId !== playerId || !playerId) {
			return;
		}

		const playersData = ServerState.getPlayersData({ roomId, playerId });
		if (!playersData) {
			return;
		}

		const { socketId, enemySocketId, enemyField, enemyShips } = playersData;

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

		if (isDamaged) {
			const enemySocket = findSocketBySocketId({ io, socketId: enemySocketId });

			if (!enemySocket) {
				return;
			}

			await handleDestroyedShip({
				field: enemyField as Field,
				ships: enemyShips as GameFieldShips,
				damagedCoords: coords,
				socket,
				enemySocket,
				roomId,
			});

			if (checkIsGameOver(roomId)) {
				socket.emit(SocketEvents.PLAYER_WON, true);
				socket.to(roomId).emit(SocketEvents.PLAYER_WON, false);
				io.socketsLeave(roomId);
				ServerState.deleteRoom(roomId);

				socket.data = {};
				enemySocket.data = {};
			}
		} else {
			changeTurn(io, roomId);
		}
	});
};
