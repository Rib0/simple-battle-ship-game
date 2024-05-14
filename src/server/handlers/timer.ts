import { Server, Socket } from 'socket.io';

import { Timer } from '@/server/lib/timer';

export const initiateTimer = (io: Server, socket: Socket) => {
	const allSocketsLength = io.sockets.sockets.size;

	if (allSocketsLength > 1 && !Timer.getTimerId) {
		Timer.start(io);
	}

	socket.on('disconnect', () => {
		const allSocketsLengthAfterDisconnect = io.sockets.sockets.size;

		if (allSocketsLengthAfterDisconnect < 2) {
			Timer.stop();
		}
	});
};
