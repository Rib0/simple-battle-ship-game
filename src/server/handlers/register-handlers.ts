import { ServerIo, ServerSocket } from '@/types/socket';
import { searchingGameHandler } from './searching-game';
import { gameActionsHandler } from './game-actions';
import { inviteByIdHandler } from './invite-by-id';
import { playerReconnectHandler } from './player-reconnect';
import { playerDisconnectHandler } from './player-disconnect';
import { setAuthDataHandler } from './set-auth-data';
import { playerLeaveGameHandler } from './player-leave-game';

export const registerHandlers = (io: ServerIo, socket: ServerSocket) => {
	gameActionsHandler(socket);
	inviteByIdHandler(socket);
	playerDisconnectHandler(io, socket);
	playerLeaveGameHandler(io, socket);
	playerReconnectHandler(socket);
	searchingGameHandler(socket);
	setAuthDataHandler(socket);
};
