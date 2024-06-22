import { ServerSocket } from '@/types/socket';

export const getPlayerId = (socket: ServerSocket) =>
	socket.handshake.auth?.playerId as string | undefined;
