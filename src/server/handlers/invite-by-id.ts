import { ServerIo, ServerSocket, SocketEvents } from '@/types/socket';
import { initiateGameWithPlayers } from '../lib/initiate-game-with-players';
import { getPlayerId } from '../lib/handshake';

export const inviteByIdHandler = (io: ServerIo, socket: ServerSocket) => {
	socket.on(SocketEvents.INVITE_BY_ID, (invitedPlayerId) => {
		const sockets = Array.from(io.sockets.sockets.values());

		const invitedPlayer = sockets.find(
			(playerSocket) => getPlayerId(playerSocket) === invitedPlayerId,
		);

		if (!invitedPlayer) {
			socket.emit(SocketEvents.NO_PLAYER_TO_INVITE);
			return;
		}

		if (invitedPlayer.data.playerInviterId) {
			return;
		}

		const inviterId = getPlayerId(socket);

		if (!inviterId || inviterId === invitedPlayerId) {
			return;
		}

		invitedPlayer.emit(SocketEvents.INVITE_BY_ID, inviterId);
		invitedPlayer.data.playerInviterId = inviterId;
		socket.data.invitedPlayerId = invitedPlayerId;
	});

	socket.on(SocketEvents.ACCEPT_INVITATION, async (playerInviterId) => {
		const sockets = Array.from(io.sockets.sockets.values());

		const playerInviter = sockets.find(
			(playerSocket) => getPlayerId(playerSocket) === playerInviterId,
		);

		const invitedPlayerId = getPlayerId(socket);

		if (!playerInviter || !invitedPlayerId) {
			return;
		}

		if (
			playerInviter?.data.invitedPlayerId !== invitedPlayerId ||
			socket.data.playerInviterId !== playerInviterId
		) {
			socket.data.playerInviterId = null;
			playerInviter.data.invitedPlayerId = null;
			return;
		}

		socket.data.playerInviterId = null;
		playerInviter.data.invitedPlayerId = null;

		const players = [playerInviter, socket];

		await initiateGameWithPlayers(players, io);
	});

	socket.on(SocketEvents.REJECT_INVITATION, (playerInviterId) => {
		const sockets = Array.from(io.sockets.sockets.values());

		const playerInviter = sockets.find(
			(playerSocket) => getPlayerId(playerSocket) === playerInviterId,
		);

		const invitedPlayerId = getPlayerId(socket);

		if (!playerInviter || !invitedPlayerId) {
			return;
		}

		if (
			playerInviter?.data.invitedPlayerId !== invitedPlayerId ||
			socket.data.playerInviterId !== playerInviterId
		) {
			socket.data.playerInviterId = null;
			playerInviter.data.invitedPlayerId = null;
			return;
		}

		socket.data.playerInviterId = null;
		playerInviter.data.invitedPlayerId = null;

		playerInviter.emit(SocketEvents.REJECT_INVITATION);
	});
};
