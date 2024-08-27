import { ServerSocket, SocketEvents } from '@/types/socket';
import { Utils } from '../lib/utils';

export const setAuthDataHandler = (socket: ServerSocket) => {
	const playerId = Utils.getPlayerId(socket);
	if (playerId) {
		socket.emit(SocketEvents.SET_AUTH_DATA, playerId);
	}
};
