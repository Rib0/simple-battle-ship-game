import { nanoid } from 'nanoid';

import { ServerIo, SocketEvents } from '@/types/socket';
import { TURN_DURATION } from '@/constants/game';
import { Timer } from './timer';
import { findSocketBySocketId, getPlayerId } from './utils';
import { ServerState } from '../models/server-state';

export const changeTurn = async (io: ServerIo, roomId: string, reconnectedPlayerId?: string) => {
	const roomData = ServerState.getRoomData(roomId);

	if (!roomData?.players) {
		return;
	}

	const [player1, player2] = Object.values(roomData?.players);

	const player1Socket = await findSocketBySocketId({ io, socketId: player1?.socketId });
	const player2Socket = await findSocketBySocketId({ io, socketId: player2?.socketId });

	if (!player1Socket || !player2Socket) {
		return;
	}

	const playersSockets = [player1Socket, player2Socket];

	const isInRoom =
		player1Socket?.data.roomId &&
		player2Socket?.data.roomId &&
		player1Socket?.data.roomId === player2Socket?.data.roomId;
	const hasDisconnected = playersSockets.some((socket) => socket?.disconnected);

	if (hasDisconnected || !isInRoom) {
		return;
	}

	const [player1Id, player2Id] = playersSockets.map((socket) => socket && getPlayerId(socket));

	if (!player1Id || !player2Id) {
		return;
	}

	const turnId = nanoid();
	const turnStartTime = Timer.getTime;
	const prevTurnPlayerId = ServerState.getTurnPlayerId(roomId);
	const isPlayer1PrevTurn = prevTurnPlayerId === player1Id;
	const turnPlayerId = isPlayer1PrevTurn ? player2Id : player1Id;

	let changeTurnCallbackDelay = TURN_DURATION;

	const changeTurnWithTime = (timeRemain: number, keepTurn?: boolean) => {
		const nextRoomData: Parameters<typeof ServerState.setRoomData>[0] = {
			roomId,
			turnId,
			turnStartTime,
		};

		if (!keepTurn) {
			roomData.turnPlayerId = turnPlayerId;
		}

		ServerState.setRoomData(nextRoomData);
		ServerState.setPlayerData({
			roomId,
			playerId: keepTurn && prevTurnPlayerId ? prevTurnPlayerId : turnPlayerId,
			playerData: { timeRemain },
		});

		if (keepTurn) {
			changeTurnCallbackDelay = timeRemain;
		}

		player1Socket.emit(
			SocketEvents.CHANGE_TURN,
			keepTurn ? isPlayer1PrevTurn : !isPlayer1PrevTurn,
			timeRemain,
		);
		player2Socket.emit(
			SocketEvents.CHANGE_TURN,
			keepTurn ? !isPlayer1PrevTurn : isPlayer1PrevTurn,
			timeRemain,
		);
	};

	if (!reconnectedPlayerId) {
		changeTurnWithTime(TURN_DURATION);
	} else {
		const isReconnectedPlayerTurn = reconnectedPlayerId === prevTurnPlayerId;

		if (isReconnectedPlayerTurn) {
			const { timeRemain = TURN_DURATION } =
				ServerState.getPlayersData({ roomId, playerId: reconnectedPlayerId }) || {};

			if (timeRemain <= 0) {
				changeTurnWithTime(TURN_DURATION);
			} else {
				changeTurnWithTime(timeRemain, true);
			}
		} else {
			changeTurnWithTime(TURN_DURATION, true);
		}
	}

	const callback = async () => {
		const isStaleTurnId = ServerState.getRoomData(roomId)?.turnId !== turnId;
		const hasDisconnectedActual = playersSockets.some((socket) => socket?.disconnected);
		const isInRoomActual =
			player1Socket?.data.roomId &&
			player2Socket?.data.roomId &&
			player1Socket?.data.roomId === player2Socket?.data.roomId;

		if (isStaleTurnId || hasDisconnectedActual || !isInRoomActual) {
			return;
		}

		await changeTurn(io, roomId);
	};

	Timer.addCallback(callback, changeTurnCallbackDelay);
};
