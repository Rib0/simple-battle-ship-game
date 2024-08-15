import { ServerSocket, SocketEvents } from '@/types/socket';
import { Timer } from '../lib/timer';
import { Utils } from '../lib/utils';
import { roomStore } from '../stores/rooms-store';

export const inviteByIdHandler = (socket: ServerSocket) => {
	socket.on(SocketEvents.INVITE_BY_ID, (invitedPlayerId) => {
		const invitedPlayer = Utils.findSocketByPlayerId(invitedPlayerId);
		const inviterId = Utils.getPlayerId(socket);

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
		const invitedPlayerId = Utils.getPlayerId(socket);
		const { playerInviterId } = socket.data;

		if (!playerInviterId || !invitedPlayerId) {
			return;
		}

		const playerInviter = Utils.findSocketByPlayerId(playerInviterId);

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

		try {
			await roomStore.createRoomWithPlayers(players);
		} catch {
			players.forEach((player) =>
				player.emit(SocketEvents.ERROR, 'Ошибка при подключении к игре'),
			);
		}
	});

	socket.on(SocketEvents.REJECT_INVITATION, () => {
		const invitedPlayerId = Utils.getPlayerId(socket);
		const { playerInviterId } = socket.data;

		if (!playerInviterId || !invitedPlayerId) {
			return;
		}

		const playerInviter = Utils.findSocketByPlayerId(playerInviterId);

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
