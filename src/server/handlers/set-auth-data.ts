import { nanoid } from 'nanoid';

import { ServerIo, ServerSocket, SocketEvents } from '@/types/socket';
import { findSocketByPlayerId, getPlayerId } from '../lib/utils';

export const setAuthDataHandler = (io: ServerIo, socket: ServerSocket) => {
	socket.on(SocketEvents.SET_AUTH_DATA, () => {
		const playerId = getPlayerId(socket) || '';

		const socketWithEqualPlayerId = findSocketByPlayerId({ io, playerId });

		if ((socketWithEqualPlayerId && socketWithEqualPlayerId !== socket) || !playerId) {
			const newPlayerId = nanoid();
			socket.handshake.auth.playerId = newPlayerId;
			socket.emit(SocketEvents.SET_AUTH_DATA, newPlayerId);
		}
	});
};
