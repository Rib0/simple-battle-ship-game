import { ServerSocket, SocketEvents } from '@/types/socket';
import { Nullable } from '@/types/utils';
import { IoConnection } from './io-connection';

export class Utils {
	private static ioConnection = IoConnection.getInstance().connection;

	static get getAllRooms() {
		return this.ioConnection.of('/').adapter.rooms;
	}

	static get getAllSockets() {
		return this.ioConnection.of('/').sockets;
	}

	static getPlayerId(socket: ServerSocket) {
		return socket.handshake.auth?.playerId as string | undefined;
	}

	static setPlayerId(socket: ServerSocket, playerId: string) {
		socket.handshake.auth.playerId = playerId;
	}

	static isInGame(socket: ServerSocket) {
		return socket.rooms.size > 1;
	}

	static findSocketBySocketId(socketId: string) {
		if (!socketId) {
			return null;
		}

		return this.ioConnection.of('/').sockets.get(socketId);
	}

	static findSocketByPlayerId(playerId: string): Nullable<ServerSocket> {
		const sockets = this.ioConnection.of('/').sockets.values();

		// eslint-disable-next-line no-restricted-syntax
		for (const socket of sockets) {
			if (this.getPlayerId(socket) === playerId) {
				return socket;
			}
		}

		return null;
	}

	static checkIfSocketsAlreadyInRoom(players: ServerSocket[]) {
		const isAlreadyInRoom = players.some((player) => this.isInGame(player));

		return isAlreadyInRoom;
	}

	static sendInvitationIfExist(socket: ServerSocket) {
		if (!socket.data.playerInviterIds || !socket.data.playerInviterIds.size) {
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

			if (
				!playerInviter.data.invitedPlayerIds ||
				!playerInviter.data.invitedPlayerIds.size ||
				!playerInviter.data.invitedPlayerIds.has(invitedPlayerId)
			) {
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
					Utils.updateAwaitingInvitationResponseStatus(playerInviter);
				}
			});
			socket.data.playerInviterIds?.clear();
			socket.data.invitedPlayerIds?.clear();
		});
	}

	static delay(ms: number) {
		return new Promise((resolve) => {
			setTimeout(resolve, ms);
		});
	}
}
