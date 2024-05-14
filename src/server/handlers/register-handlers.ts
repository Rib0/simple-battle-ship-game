import { Server, Socket } from 'socket.io';

import { searchingGameHandler } from './searching-game';
import { initialHeadersHandler } from './initial-headers';
import { gameActionsHandler } from './game-actions';
import { initiateTimer } from './timer';

export const registerHandlers = (io: Server, socket: Socket) => {
	initiateTimer(io, socket);
	initialHeadersHandler(io);
	searchingGameHandler(io, socket);
	gameActionsHandler(io, socket);
};
