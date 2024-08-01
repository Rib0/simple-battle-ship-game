import { ServerIo, ServerSocket } from '@/types/socket';

export const getPlayerId = (socket: ServerSocket) =>
	socket.handshake.auth?.playerId as string | undefined;

export const findSocketBySocketId = async ({
	io,
	socketId,
}: {
	io: ServerIo;
	socketId?: string;
}) => {
	const sockets = (await io.fetchSockets()) as unknown as ServerSocket[];

	return sockets.find((playerSocket) => playerSocket.id === socketId);
};

export const findSocketByPlayerId = async ({
	io,
	playerId,
}: {
	io: ServerIo;
	playerId: string;
}) => {
	const sockets = (await io.fetchSockets()) as unknown as ServerSocket[];

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

export const delay = (ms: number) =>
	new Promise((resolve) => {
		setTimeout(resolve, ms);
	});
