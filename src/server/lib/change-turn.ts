import { nanoid } from 'nanoid';

import { ServerIo, SocketEvents } from '@/types/socket';
import { TURN_DURATION, TURN_DURATION_MS } from '@/constants/game';
import { Timer } from './timer';
import { ROOMS } from '../constants';
import { getPlayerId } from './get-data';

// TODO: поправить тут все

export const changeTurn = (io: ServerIo, roomId: string, reconnectedPlayerId?: string) => {
	const roomData = ROOMS[roomId];

	if (!roomData?.players) {
		return;
	}

	const [player1, player2] = Object.values(roomData?.players);

	const sockets = Array.from(io.sockets.sockets.values());
	const playersSockets = sockets.filter(
		(socket) => player1?.socketId === socket.id || player2?.socketId === socket.id,
	);
	const [playerSocket1, playerSocket2] = playersSockets;

	if (playersSockets.length < 2) {
		return;
	}

	const hasDisconnected = playersSockets.some((player) => player.disconnected);
	const isInRoom = playerSocket1.data.roomId === playerSocket2.data.roomId;

	if (hasDisconnected || !isInRoom) {
		return;
	}

	const [player1Id, player2Id] = playersSockets.map((socket) => getPlayerId(socket));
	const isFirstMove = !roomData.turnPlayerId;

	const turnStartTime = Timer.getTime;
	const turnId = nanoid();
	const isPlayer1Turn = roomData.turnPlayerId === player1Id;

	if (!reconnectedPlayerId) {
		if (isFirstMove) {
			roomData.turnPlayerId = player1Id;
		} else {
			roomData.turnPlayerId = isPlayer1Turn ? player2Id : player1Id;
		}

		roomData.turnId = turnId; // TODO: вынести в отдельную функцию
		roomData.turnStartTime = turnStartTime;

		playerSocket1.emit(SocketEvents.CHANGE_TURN, !isPlayer1Turn, turnStartTime);
		playerSocket2.emit(SocketEvents.CHANGE_TURN, isPlayer1Turn, turnStartTime);
	} else {
		const isReconnectedPlayerTurn = reconnectedPlayerId === roomData.turnPlayerId;
		const reconnectedPlayer = roomData.players[reconnectedPlayerId];
		const disconnectedTime = turnStartTime - (reconnectedPlayer?.disconnectedTime || 0);

		if (isReconnectedPlayerTurn) {
			if (disconnectedTime > TURN_DURATION) {
				roomData.turnId = turnId; // TODO: вынести в отдельную функцию
				roomData.turnStartTime = turnStartTime;

				playerSocket1.emit(SocketEvents.CHANGE_TURN, !isPlayer1Turn, turnStartTime);
				playerSocket2.emit(SocketEvents.CHANGE_TURN, isPlayer1Turn, turnStartTime);
			} else {
				const turnStartTimeWithDisconnectedDiff = turnStartTime - disconnectedTime;

				playerSocket1.emit(
					SocketEvents.CHANGE_TURN,
					isPlayer1Turn,
					turnStartTimeWithDisconnectedDiff,
				);
				playerSocket2.emit(
					SocketEvents.CHANGE_TURN,
					!isPlayer1Turn,
					turnStartTimeWithDisconnectedDiff,
				);
			}
		} else {
			playerSocket1.emit(SocketEvents.CHANGE_TURN, isPlayer1Turn, turnStartTime);
			playerSocket2.emit(SocketEvents.CHANGE_TURN, !isPlayer1Turn, turnStartTime);
		}
	}

	const callback = () => {
		const isStaleTurnId = roomData.turnId !== turnId;
		const hasDisconnectedActual = playersSockets.some((player) => player.disconnected);
		const isInRoomActual = playerSocket1.data.roomId === playerSocket2.data.roomId;

		if (isStaleTurnId || hasDisconnectedActual || !isInRoomActual) {
			return;
		}

		changeTurn(io, roomId); // TODO: здесь проставлять корректное время для смены хода в зависимости от переподключения и всего остального
	};

	Timer.addCallback(callback, TURN_DURATION_MS);
};
