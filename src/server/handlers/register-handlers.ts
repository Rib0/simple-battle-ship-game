import { ServerIo, ServerSocket } from '@/types/socket';
import { searchingGameHandler } from './searching-game';
import { initialHeadersHandler } from './initial-headers';
import { gameActionsHandler } from './game-actions';
import { inviteByIdHandler } from './invite-by-id';
import { playerReconnectHandler } from './player-reconnect';
import { playerDisconnectHandler } from './player-disconnect';

export const registerHandlers = (io: ServerIo, socket: ServerSocket) => {
	initialHeadersHandler(io);
	playerDisconnectHandler(io, socket);
	gameActionsHandler(io, socket);
	playerReconnectHandler(io, socket);
	searchingGameHandler(io, socket);
	inviteByIdHandler(io, socket);
};
