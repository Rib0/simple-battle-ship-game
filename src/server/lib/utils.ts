import { ServerSocket } from '@/types/socket';
import { Nullable } from '@/types/utils';
import { customAlphabet } from 'nanoid';
import { IoConnection } from './io-connection';

export class Utils {
	private static ioConnection = IoConnection.getInstance().connection;

	private static nanoid = customAlphabet('1234567890', 5);

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

	static delay(ms: number) {
		return new Promise((resolve) => {
			setTimeout(resolve, ms);
		});
	}

	static nanoidDigits() {
		return this.nanoid();
	}
}
