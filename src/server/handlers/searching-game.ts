import { ServerSocket, SocketEvents } from '@/types/socket';
import { appStore } from '../stores/app-store';

export const searchingGameHandler = (socket: ServerSocket) => {
	socket.on(SocketEvents.SEARCH_GAME, () => {
		appStore.addSearchingGamePlayerId(socket);
	});

	socket.on(SocketEvents.CANCEL_SEARCH_GAME, () => {
		appStore.removeSearchingGamePlayersIds([socket]);
	});
};
