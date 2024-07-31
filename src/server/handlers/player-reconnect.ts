import { GameState, ServerIo, ServerSocket, SocketEvents } from '@/types/socket';
import { Field } from '@/types/game-field';
import {
	checkIsAllPlayersConnectedBySocketIds,
	findSocketBySocketId,
	getPlayerId,
} from '../lib/utils';
import { changeTurn } from '../lib/change-turn';
import { ServerState } from '../server-state';

export const playerReconnectHandler = (io: ServerIo, socket: ServerSocket) => {
	socket.on(SocketEvents.FIND_GAME_TO_RECONNECT, async (roomId) => {
		const playerId = getPlayerId(socket);

		if (!playerId) {
			return;
		}

		const playersData = ServerState.getPlayersData({ roomId, playerId });
		if (!playersData) {
			return;
		}

		const {
			enemySocketId,
			enemyField,
			socketId,
			field,
			ships,
			killedShipsInitialCoords,
			enemyKilledShips,
		} = playersData;

		const isAllPlayerConnected = checkIsAllPlayersConnectedBySocketIds({
			io,
			socketIds: [socketId, enemySocketId],
		});

		if (isAllPlayerConnected) {
			return;
		}

		socket.data.roomId = roomId;

		const playerData = { socketId: socket.id };
		ServerState.setPlayerData({ roomId, playerId, playerData });

		await socket.join(roomId);

		const playerGameState = {
			field,
			ships,
			killedShipsInitialCoords,
			enemyKilledShips,
		} as GameState;
		const isEnemyPlayerSocketConnected =
			findSocketBySocketId({ io, socketId: enemySocketId })?.connected || false;

		socket.to(roomId).emit(SocketEvents.ENEMY_RECONNECTED_TO_ROOM);
		socket.emit(
			SocketEvents.RECONNECTED_TO_ROOM,
			playerGameState,
			enemyField as Field,
			isEnemyPlayerSocketConnected,
		);
		changeTurn(io, roomId, playerId);
	});
};
