import { ServerIo, ServerSocket } from '@/types/socket';
import { searchingGameHandler } from './searching-game';
import { gameActionsHandler } from './game-actions';
import { inviteByIdHandler } from './invite-by-id';
import { playerReconnectHandler } from './player-reconnect';
import { playerDisconnectHandler } from './player-disconnect';
import { setAuthData } from './set-auth-data';

export const registerHandlers = (io: ServerIo, socket: ServerSocket) => {
	setAuthData(io, socket);
	playerDisconnectHandler(io, socket);
	gameActionsHandler(io, socket);
	playerReconnectHandler(io, socket);
	searchingGameHandler(io, socket);
	inviteByIdHandler(io, socket);
};
