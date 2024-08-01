import { ServerIo, ServerSocket, SocketEvents } from '@/types/socket';
import { initiateGameWithPlayers } from '../lib/initiate-game-with-players';
import { findSocketByPlayerId, getPlayerId } from '../lib/utils';
import { Timer } from '../lib/timer';

export const inviteByIdHandler = (io: ServerIo, socket: ServerSocket) => {
	socket.on(SocketEvents.INVITE_BY_ID, async (invitedPlayerId) => {
		const invitedPlayer = await findSocketByPlayerId({ io, playerId: invitedPlayerId });
		const inviterId = getPlayerId(socket);

		if (!invitedPlayer || !inviterId) {
			socket.emit(SocketEvents.INVITATION_FAILED);
			socket.emit(SocketEvents.ERROR, 'Игрока с таким id не существует');
			return;
		}

		if (invitedPlayer.data.playerInviterId) {
			socket.emit(SocketEvents.INVITATION_FAILED);
			socket.emit(SocketEvents.ERROR, 'Игрок уже приглашен, попробуйте еще раз');
			return;
		}

		if (inviterId === invitedPlayerId) {
			socket.emit(SocketEvents.INVITATION_FAILED);
			socket.emit(SocketEvents.ERROR, 'Нельзя пригласить себя');
			return;
		}

		if (socket.data.invitedPlayerId) {
			return;
		}

		invitedPlayer.emit(SocketEvents.INVITE_BY_ID, inviterId);
		invitedPlayer.data.playerInviterId = inviterId;
		socket.data.invitedPlayerId = invitedPlayerId;

		Timer.addCallback(() => {
			if (
				socket.data.invitedPlayerId !== invitedPlayerId ||
				invitedPlayer.data.playerInviterId !== inviterId
			) {
				return;
			}

			invitedPlayer.data.playerInviterId = null;
			socket.data.invitedPlayerId = null;

			socket.emit(SocketEvents.INVITATION_FAILED);
			socket.emit(SocketEvents.WARNING, `Пользователь не ответил на приглашение`);
		}, 10);
	});

	socket.on(SocketEvents.ACCEPT_INVITATION, async () => {
		const invitedPlayerId = getPlayerId(socket);
		const { playerInviterId } = socket.data;

		if (!playerInviterId || !invitedPlayerId) {
			return;
		}

		const playerInviter = await findSocketByPlayerId({ io, playerId: playerInviterId });

		if (!playerInviter) {
			socket.emit(SocketEvents.ERROR, 'Не удалось начать игру. Пользователь вышел из игры');
			return;
		}

		if (
			playerInviter.data.invitedPlayerId !== invitedPlayerId ||
			socket.data.playerInviterId !== playerInviterId
		) {
			socket.data.playerInviterId = null;
			playerInviter.data.invitedPlayerId = null;

			socket.emit(SocketEvents.ERROR, 'Произошла ошибка. Не удалось начать игру');
			return;
		}

		socket.data.playerInviterId = null;
		playerInviter.data.invitedPlayerId = null;

		const players = [playerInviter, socket];

		await initiateGameWithPlayers(players, io);
	});

	socket.on(SocketEvents.REJECT_INVITATION, async () => {
		const invitedPlayerId = getPlayerId(socket);
		const { playerInviterId } = socket.data;

		if (!playerInviterId || !invitedPlayerId) {
			return;
		}

		const playerInviter = await findSocketByPlayerId({ io, playerId: playerInviterId });

		if (!playerInviter) {
			return;
		}

		if (
			playerInviter.data.invitedPlayerId !== invitedPlayerId ||
			socket.data.playerInviterId !== playerInviterId
		) {
			socket.data.playerInviterId = null;
			playerInviter.data.invitedPlayerId = null;
			return;
		}

		socket.data.playerInviterId = null;
		playerInviter.data.invitedPlayerId = null;

		playerInviter.emit(SocketEvents.INVITATION_FAILED);
		playerInviter.emit(SocketEvents.WARNING, 'Пользователь отказался от игры');
	});
};
