import { nanoid } from 'nanoid';

import { ServerSocket, SocketEvents } from '@/types/socket';
import { Timer } from './timer';

export const changeTurn = (players: ServerSocket[]) => {
	const [player1, player2] = players;

	const hasDisconnected = players.some((player) => player.disconnected);

	if (hasDisconnected) {
		return;
	}

	const isFirstMove = players.every((player) => !player.data.turn);

	if (isFirstMove) {
		player1.data.turn = true;
		player2.data.turn = false;
	} else {
		player1.data.turn = !player1.data.turn;
		player2.data.turn = !player2.data.turn;
	}

	player1.emit(SocketEvents.CHANGE_TURN, player1.data.turn);
	player2.emit(SocketEvents.CHANGE_TURN, player2.data.turn);

	const turnId = nanoid();

	player1.data.turnId = turnId;
	player2.data.turnId = turnId;

	const callback = () => {
		const isStaleTurnId = players.some((player) => player.data.turnId !== turnId);
		if (isStaleTurnId || hasDisconnected) {
			return;
		}

		changeTurn(players);
	};

	Timer.addCallback(callback, 30_000);
};
