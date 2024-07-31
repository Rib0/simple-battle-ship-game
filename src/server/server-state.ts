import { Rooms, ServerIo, ServerSocket, SetPlayerData } from '@/types/socket';
import { initiateGameWithPlayers } from './lib/initiate-game-with-players';

export class ServerState {
	private static searchingGamePlayers: ServerSocket[] = [];

	static rooms: Rooms = {};

	private static isSearching: NodeJS.Timeout | undefined;

	static async tryPutPlayersToRoom(io: ServerIo) {
		this.isSearching = setTimeout(() => this.tryPutPlayersToRoom(io), 3000);

		const players = this.getPlayersForGame;

		if (players.length < 2) {
			clearTimeout(this.isSearching);
			this.isSearching = undefined;
			return;
		}

		await initiateGameWithPlayers(players, io);
	}

	static getSearchingGamePlayerSocket(socket: ServerSocket) {
		return this.searchingGamePlayers.find((player) => player === socket);
	}

	static get getPlayersForGame() {
		return this.searchingGamePlayers.slice(0, 2);
	}

	static addSeachingGamePlayer(socket: ServerSocket) {
		this.searchingGamePlayers.push(socket);
	}

	static removeSearchingGamePlayers(sockets: ServerSocket[]) {
		this.searchingGamePlayers = this.searchingGamePlayers.filter(
			(socket) => !sockets.includes(socket),
		);
	}

	static getRoomData(roomId: string) {
		const roomData = this.rooms[roomId];

		return roomData;
	}

	static setRoomData({
		roomId,
		...newRoomData
	}: {
		roomId: string;
		turnPlayerId?: string;
		turnId?: string;
		turnStartTime?: number;
	}) {
		const roomData = this.getRoomData(roomId);

		this.rooms[roomId] = {
			...roomData,
			...newRoomData,
		};
	}

	static deleteRoom(roomId: string) {
		delete this.rooms[roomId];
	}

	static getTurnPlayerId(roomId: string) {
		return this.getRoomData(roomId)?.turnPlayerId;
	}

	static getPlayersData({ roomId, playerId }: { roomId: string; playerId: string }) {
		const roomData = this.getRoomData(roomId);
		const players = roomData?.players;

		if (!players) {
			return null;
		}

		const {
			disconnectedTime,
			timeRemain,
			enemyPlayerId = '',
			socketId,
			field,
			ships,
			killedShipsInitialCoords,
			enemyKilledShips,
		} = players?.[playerId] || {};
		const {
			disconnectedTime: enemyDisconnectedTime,
			timeRemain: enemyTimeRemain,
			enemyPlayerId: enemyEnemyPlayerId,
			socketId: enemySocketId,
			field: enemyField,
			ships: enemyShips,
		} = players?.[enemyPlayerId] || {};

		return {
			disconnectedTime,
			timeRemain,
			enemyPlayerId,
			socketId,
			field,
			ships,
			killedShipsInitialCoords,
			enemyKilledShips,
			enemyDisconnectedTime,
			enemyTimeRemain,
			enemyEnemyPlayerId,
			enemySocketId,
			enemyField,
			enemyShips,
		};
	}

	static setPlayerData({
		roomId,
		playerId,
		playerData,
	}: {
		roomId: string;
		playerId: string;
		playerData: Partial<SetPlayerData>;
	}) {
		const { players = {}, ...restRoomData } = this.getRoomData(roomId) || {};
		const prevPlayerData = players[playerId] || {};
		const {
			killedShipsInitialCoords: prevKilledShipsInitialCoords = [],
			enemyKilledShips: prevEnemyKilledShips = {},
		} = prevPlayerData;
		const { killedShipsInitialCoords = [], enemyKilledShips = {} } = playerData;

		this.rooms[roomId] = {
			...restRoomData,
			players: {
				...players,
				[playerId]: {
					...prevPlayerData,
					...playerData,
					killedShipsInitialCoords:
						prevKilledShipsInitialCoords.concat(killedShipsInitialCoords),
					enemyKilledShips: {
						...prevEnemyKilledShips,
						...enemyKilledShips,
					},
				},
			},
		};
	}
}
