import { ServerIo, ServerSocket, SocketEvents } from '@/types/socket';
import { getPlayerIdByHandshake } from '../lib/cookie';

export const inviteByIdHandler = (io: ServerIo, socket: ServerSocket) => {
	socket.on(SocketEvents.INVITE_BY_ID, (id) => {
		const sockets = Array.from(io.sockets.sockets.values());

		const invitedPlayer = sockets.find(
			(playerSocket) => getPlayerIdByHandshake(playerSocket) === id,
		);

		if (!invitedPlayer) {
			socket.emit(SocketEvents.NO_PLAYER_TO_INVITE);
			return;
		}

		const inviterId = getPlayerIdByHandshake(socket);
		invitedPlayer.emit(SocketEvents.INVITED, inviterId);
	});
};
