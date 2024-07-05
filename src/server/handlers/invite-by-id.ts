import { ServerIo, ServerSocket, SocketEvents } from '@/types/socket';
import { initiateGameWithPlayers } from '../lib/initiate-game-with-players';
import { findSocketByPlayerId, getPlayerId } from '../lib/utils';

export const inviteByIdHandler = (io: ServerIo, socket: ServerSocket) => {
	socket.on(SocketEvents.INVITE_BY_ID, (invitedPlayerId) => {
		const invitedPlayer = findSocketByPlayerId({ io, playerId: invitedPlayerId });
		const inviterId = getPlayerId(socket);

		if (!invitedPlayer || !inviterId) {
			socket.emit(SocketEvents.NO_PLAYER_TO_INVITE);
			return;
		}

		if (invitedPlayer.data.playerInviterId) {
			// Игрок уже приглашен
			return;
		}

		if (inviterId === invitedPlayerId) {
			return;
		}

		invitedPlayer.emit(SocketEvents.INVITE_BY_ID, inviterId);
		invitedPlayer.data.playerInviterId = inviterId;
		socket.data.invitedPlayerId = invitedPlayerId;
	});

	socket.on(SocketEvents.ACCEPT_INVITATION, async (playerInviterId) => {
		const playerInviter = findSocketByPlayerId({ io, playerId: playerInviterId });
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
		const playerInviter = findSocketByPlayerId({ io, playerId: playerInviterId });
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
