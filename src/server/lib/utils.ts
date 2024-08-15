import { ServerSocket } from '@/types/socket';
import { IoConnection } from './io-connection';

// TODO: поменять на UTILS везде где используются функкции отсюда

export class Utils {
	private static ioConnection = IoConnection.getInstance().connection;

	static get getAllRooms() {
		return this.ioConnection.of('/').adapter.rooms;
	}

	static getPlayerId(socket: ServerSocket) {
		return socket.handshake.auth?.playerId as string | undefined;
	}

	static findSocketBySocketId(socketId: string) {
		// TODO: посмотреть зачем
		if (!socketId) {
			return null;
		}

		return this.ioConnection.of('/').sockets.get(socketId);
	}

	static findSocketByPlayerId(playerId: string) {
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
		const isAlreadyInRoom = players.some((player) => player.rooms.size > 1); // TODO: проверить, было 2

		return isAlreadyInRoom;
	}

	static delay(ms: number) {
		return new Promise((resolve) => {
			setTimeout(resolve, ms);
		});
	}
}
