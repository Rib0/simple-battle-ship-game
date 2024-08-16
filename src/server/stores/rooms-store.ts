import { ServerSocket, SocketEvents } from '@/types/socket';
import { Room } from '../models/room';
import { IoConnection } from '../lib/io-connection';
import { Utils } from '../lib/utils';

class RoomsStore {
	private ioConnection = IoConnection.getInstance().connection;

	private rooms = new Map<string, Room>();

	async createRoomWithPlayers(players: ServerSocket[]) {
		const isAlreadyInRoom = Utils.checkIfSocketsAlreadyInRoom(players);

		setTimeout(() => {
			Utils.checkIfSocketsAlreadyInRoom(players);
		}, 5000);

		if (isAlreadyInRoom) {
			throw new Error();
		}

		const room = new Room();

		this.rooms.set(room.id, room);

		const [player1, player2] = players;

		try {
			await Promise.all(
				players.map((player) => {
					player.data.roomId = room.id;
					return player.join(room.id);
				}),
			);

			const [player1GameState, player2GameState] = await Promise.all(
				players.map((player) => player.emitWithAck(SocketEvents.JOINED_ROOM, room.id)),
			);

			const [player1Id, player2Id] = players.map((player) => Utils.getPlayerId(player));

			if (!player1Id || !player2Id) {
				return;
			}

			const player1Data = {
				id: player1Id,
				data: {
					socketId: player1.id,
					enemyPlayerId: player2Id,
					...player1GameState,
				},
			};
			const player2Data = {
				id: player2Id,
				data: {
					socketId: player2.id,
					enemyPlayerId: player1Id,
					...player2GameState,
				},
			};
			const playersData = [player1Data, player2Data];

			room.addPlayers(playersData);
			room.changeTurn(undefined, true);
		} catch (e) {
			this.ioConnection.socketsLeave(room.id);
			this.deleteRoom(room.id);

			throw e;
		}
	}

	getRoom(roomId: string) {
		return this.rooms.get(roomId);
	}

	deleteRoom(roomId: string) {
		this.rooms.delete(roomId);
	}
}

const roomStore = new RoomsStore();

export { roomStore };
