import { nanoid } from 'nanoid';

import { ServerIo, ServerSocket, SocketEvents } from '@/types/socket';
import { getPlayerId } from '../lib/handshake';

export const setAuthData = (io: ServerIo, socket: ServerSocket) => {
	socket.on(SocketEvents.SET_AUTH_DATA, () => {
		const playerId = getPlayerId(socket);

		if (!playerId) {
			const newPlayerId = nanoid();
			socket.emit(SocketEvents.SET_AUTH_DATA, newPlayerId);

			return;
		}

		const sockets = Array.from(io.sockets.sockets.values());
		const socketWithEqualPlayerId = sockets.find(
			(playerSocket) => playerSocket !== socket && getPlayerId(playerSocket) === playerId,
		);

		if (!socketWithEqualPlayerId) {
			return;
		}

		const newPlayerId = nanoid();
		socket.emit(SocketEvents.SET_AUTH_DATA, newPlayerId);
	});
};
