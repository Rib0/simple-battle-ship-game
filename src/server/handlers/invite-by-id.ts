import { ServerSocket, SocketEvents } from '@/types/socket';
import { Nullable } from '@/types/utils';
import { Utils } from '../lib/utils';
import { InvitationUtils } from '../lib/invitation-utils';
import { roomStore } from '../stores/rooms-store';

export const inviteByIdHandler = (socket: ServerSocket) => {
	socket.on(SocketEvents.INVITE_BY_ID, (invitedPlayerId) => {
		const invitedPlayer = Utils.findSocketByPlayerId(invitedPlayerId);
		const inviterId = Utils.getPlayerId(socket);

		if (Utils.isInGame(socket)) {
			return;
		}

		if (inviterId === invitedPlayerId) {
			return;
		}

		if (!invitedPlayer || !inviterId) {
			socket.emit(SocketEvents.ERROR, 'Игрока с таким id не существует');
			return;
		}

		if (Utils.isInGame(invitedPlayer)) {
			socket.emit(SocketEvents.ERROR, 'Пользователь уже начал игру');
			return;
		}

		if (!invitedPlayer.data.playerInviterIds?.size) {
			invitedPlayer.emit(SocketEvents.INVITE_BY_ID, inviterId);
		}

		socket.data.invitedPlayerIds?.add(invitedPlayerId);
		invitedPlayer.data.playerInviterIds?.add(inviterId);

		InvitationUtils.updateAwaitingInvitationResponseStatus(socket);
	});

	socket.on(SocketEvents.ACCEPT_INVITATION, async (playerInviterId) => {
		const invitedPlayerId = Utils.getPlayerId(socket) || '';
		let playerInviter: Nullable<ServerSocket> = null;

		try {
			if (!socket.data.playerInviterIds?.has(playerInviterId)) {
				socket.emit(SocketEvents.ERROR, 'Ошибка при создании игры, попробуйте еще раз');
				throw new Error();
			} else {
				playerInviter = Utils.findSocketByPlayerId(playerInviterId);

				if (!playerInviter) {
					socket.emit(
						SocketEvents.ERROR,
						'Ошибка при создании игры, пользователь не в сети',
					);
					throw new Error();
				} else if (
					!playerInviter.data.invitedPlayerIds ||
					!playerInviter.data.invitedPlayerIds.size ||
					!playerInviter.data.invitedPlayerIds.has(invitedPlayerId)
				) {
					const errorMessage = Utils.isInGame(playerInviter)
						? 'Пользователь уже начал игру'
						: 'Ошибка при создании игры, попробуйте еще раз';

					socket.emit(SocketEvents.ERROR, errorMessage);
					socket.data.playerInviterIds.delete(playerInviterId);
					throw new Error();
				} else {
					const players = [playerInviter, socket];

					try {
						await roomStore.createRoomWithPlayers(players);
					} catch {
						players.forEach((player) =>
							player.emit(SocketEvents.ERROR, 'Ошибка при подключении к игре'),
						);
						socket.data.playerInviterIds.delete(playerInviterId);
						playerInviter.data.invitedPlayerIds.delete(invitedPlayerId);
						throw new Error();
					} finally {
						InvitationUtils.updateAwaitingInvitationResponseStatus(socket);
						InvitationUtils.updateAwaitingInvitationResponseStatus(playerInviter);
					}
				}
			}
		} catch {
			InvitationUtils.sendInvitationIfExist(socket);
		}
	});

	socket.on(SocketEvents.REJECT_INVITATION, (playerInviterId) => {
		const invitedPlayerId = Utils.getPlayerId(socket) || '';
		const playerInviter = Utils.findSocketByPlayerId(playerInviterId);

		if (
			playerInviter &&
			!Utils.isInGame(playerInviter) &&
			playerInviter.data.invitedPlayerIds?.has(invitedPlayerId)
		) {
			playerInviter.data.invitedPlayerIds?.delete(invitedPlayerId);
			InvitationUtils.updateAwaitingInvitationResponseStatus(playerInviter);
			playerInviter.emit(SocketEvents.WARNING, 'Пользователь отказался от игры');
		}

		socket.data.playerInviterIds?.delete(playerInviterId);
		InvitationUtils.sendInvitationIfExist(socket);
	});
};
