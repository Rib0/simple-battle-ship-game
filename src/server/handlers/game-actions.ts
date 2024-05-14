import { Server, Socket } from 'socket.io';

import { AttackEventPlayload, SocketEvents } from '@/types/socket-events';

export const gameActionsHandler = (io: Server, socket: Socket) => {
	socket.on(SocketEvents.ATTACK, ({ roomId, coords }: AttackEventPlayload) => {
		socket.to(roomId).emit(SocketEvents.ATTACK, coords);
	});
};
