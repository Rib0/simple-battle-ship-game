import { ServerSocket, SocketEvents } from '@/types/socket';
import { Utils } from './utils';

export class InvitationUtils {
	static sendInvitationIfExist(socket: ServerSocket) {
		if (!socket.data.playerInviterIds?.size) {
			return;
		}

		const invitedPlayerId = Utils.getPlayerId(socket);
		if (!invitedPlayerId) {
			return;
		}

		const playerInviterIds = socket.data.playerInviterIds.values();
		let [firstPlayerInviterId] = playerInviterIds;

		while (firstPlayerInviterId) {
			const playerInviter = Utils.findSocketByPlayerId(firstPlayerInviterId);

			if (!playerInviter) {
				socket.data.playerInviterIds.delete(firstPlayerInviterId);
				[firstPlayerInviterId] = playerInviterIds;
				// eslint-disable-next-line no-continue
				continue;
			}

			if (!playerInviter.data.invitedPlayerIds?.has(invitedPlayerId)) {
				socket.data.playerInviterIds.delete(firstPlayerInviterId);
				[firstPlayerInviterId] = playerInviterIds;
				// eslint-disable-next-line no-continue
				continue;
			}

			if (!socket.data.playerInviterIds?.size) {
				socket.emit(SocketEvents.INVITE_BY_ID, firstPlayerInviterId);
				return;
			}
		}
	}

	static updateAwaitingInvitationResponseStatus(socket: ServerSocket) {
		const invitedPlayerIdsSize = socket.data.invitedPlayerIds?.size;

		socket.emit(
			SocketEvents.UPDATE_AWAITING_INVITATION_RESPONSE_STATUS,
			!!invitedPlayerIdsSize,
		);
	}

	static deletePlayersIdsFromInvitationStates(sockets: ServerSocket[]) {
		sockets.forEach((socket) => {
			socket.data.playerInviterIds?.forEach((playerInviterId) => {
				const playerInviter = Utils.findSocketByPlayerId(playerInviterId);

				if (playerInviter) {
					const invitedPlayerIdToDelete = Utils.getPlayerId(socket) || '';
					playerInviter.data.invitedPlayerIds?.delete(invitedPlayerIdToDelete);
					this.updateAwaitingInvitationResponseStatus(playerInviter);
				}
			});
			socket.data.playerInviterIds?.clear();
			socket.data.invitedPlayerIds?.clear();
		});
	}
}
