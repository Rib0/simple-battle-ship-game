import { ServerSocket, SocketEvents, UserOnlineFromServer } from '@/types/socket';
import { Utils } from '../lib/utils';

export const usersOnlineHandler = (socket: ServerSocket) => {
	const playerId = Utils.getPlayerId(socket);
	if (playerId) {
		socket.broadcast.emit(SocketEvents.USER_JOINED, playerId);
	}

	socket.on(SocketEvents.GET_USERS_ONLINE, () => {
		const allSockets = [...Utils.getAllSockets.values()];

		const result = allSockets.reduce<UserOnlineFromServer>(
			(acc, playerSocket) => {
				// eslint-disable-next-line @typescript-eslint/no-shadow
				const playerId = Utils.getPlayerId(playerSocket);
				if (!playerId) {
					return acc;
				}

				const isInGame = Utils.isInGame(playerSocket);
				const playerData = { playerId, isInGame };

				acc.users[playerId] = playerData;

				if (isInGame) {
					acc.inGameAmount += 1;
				}

				return acc;
			},
			{
				users: {},
				inGameAmount: 0,
			},
		);

		socket.emit(SocketEvents.GET_USERS_ONLINE, result);
	});
};
