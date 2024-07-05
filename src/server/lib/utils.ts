import { ServerIo, ServerSocket, PlayerData } from '@/types/socket';
import { ROOMS } from '../constants';

export const getPlayerId = (socket: ServerSocket) =>
	socket.handshake.auth?.playerId as string | undefined;

export const getRoomData = (roomId: string) => {
	const roomData = ROOMS[roomId];

	return roomData;
};

export const getTurnPlayerId = (roomId: string) => getRoomData(roomId)?.turnPlayerId;

export const getPlayersData = ({ roomId, playerId }: { roomId: string; playerId: string }) => {
	const roomData = getRoomData(roomId);
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
		enemyDisconnectedTime,
		enemyTimeRemain,
		enemyEnemyPlayerId,
		enemySocketId,
		enemyField,
		enemyShips,
	};
};

export const setRoomData = ({
	roomId,
	...newRoomData
}: {
	roomId: string;
	turnPlayerId?: string;
	turnId?: string;
	turnStartTime?: number;
}) => {
	const roomData = getRoomData(roomId);

	ROOMS[roomId] = {
		...roomData,
		...newRoomData,
	};
};

export const deleteRoom = (roomId: string) => delete ROOMS[roomId];

export const setPlayerData = ({
	roomId,
	playerId,
	playerData,
}: {
	roomId: string;
	playerId: string;
	playerData: Partial<PlayerData>;
}) => {
	const { players = {}, ...restRoomData } = getRoomData(roomId) || {};
	const prevPlayerData = players[playerId] || {};

	ROOMS[roomId] = {
		...restRoomData,
		players: {
			...players,
			[playerId]: {
				...prevPlayerData,
				...playerData,
			},
		},
	};
};

export const findSocketBySocketId = ({ io, socketId }: { io: ServerIo; socketId?: string }) => {
	const sockets = Array.from(io.sockets.sockets.values());

	return sockets.find((playerSocket) => playerSocket.id === socketId);
};

export const findSocketByPlayerId = ({ io, playerId }: { io: ServerIo; playerId: string }) => {
	const sockets = Array.from(io.sockets.sockets.values());

	return sockets.find((playerSocket) => getPlayerId(playerSocket) === playerId);
};

export const checkIsAllPlayersConnectedBySocketIds = ({
	io,
	socketIds,
}: {
	io: ServerIo;
	socketIds: (string | undefined)[];
}) =>
	socketIds.every((id) => {
		if (!id) {
			return false;
		}

		return io.sockets.sockets.get(id)?.connected;
	});
