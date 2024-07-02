import { ServerIo, ServerSocket, PlayerData } from '@/types/socket';
import { ROOMS } from '../constants';

export const getPlayerId = (socket: ServerSocket) =>
	socket.handshake.auth?.playerId as string | undefined;

export const getTurnPlayerId = (roomId: string) => ROOMS[roomId]?.turnPlayerId;

export const getPlayersData = ({ roomId, playerId }: { roomId: string; playerId: string }) => {
	const players = ROOMS[roomId]?.players;

	if (!players) {
		return null;
	}

	const {
		disconnectedTime,
		enemyPlayerId = '',
		socketId,
		field,
		ships,
	} = players?.[playerId] || {};
	const {
		disconnectedTime: enemyDisconnectedTime,
		enemyPlayerId: enemyEnemyPlayerId,
		socketId: enemySocketId,
		field: enemyField,
		ships: enemyShips,
	} = players?.[enemyPlayerId] || {};

	return {
		disconnectedTime,
		enemyPlayerId,
		socketId,
		field,
		ships,
		enemyDisconnectedTime,
		enemyEnemyPlayerId,
		enemySocketId,
		enemyField,
		enemyShips,
	};
};

export const setPlayerData = ({
	roomId,
	playerId,
	playerData,
}: {
	roomId: string;
	playerId: string;
	playerData: Partial<PlayerData>;
}) => {
	const room = ROOMS[roomId]?.players || {};
	const prevPlayerData = room[playerId];

	room[playerId] = {
		...prevPlayerData,
		...playerData,
	};
};

export const findSocketByPlayerId = ({ io, playerId }: { io: ServerIo; playerId: string }) => {
	const sockets = Array.from(io.sockets.sockets.values());

	return sockets.find((playerSocket) => getPlayerId(playerSocket) === playerId);
};

export const findSocketBySocketId = ({ io, socketId }: { io: ServerIo; socketId?: string }) => {
	const sockets = Array.from(io.sockets.sockets.values());

	return sockets.find((playerSocket) => playerSocket.id === socketId);
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
