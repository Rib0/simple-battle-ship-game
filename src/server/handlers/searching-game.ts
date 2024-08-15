import { ServerSocket, SocketEvents } from '@/types/socket';
import { appStore } from '../stores/app-store';

export const searchingGameHandler = (socket: ServerSocket) => {
	socket.on(SocketEvents.SEARCH_GAME, () => {
		appStore.addSearchingGamePlayer(socket);
	});

	socket.on(SocketEvents.CANCEL_SEARCH_GAME, () => {
		appStore.removeSearchingGamePlayers([socket]);
	});
};
