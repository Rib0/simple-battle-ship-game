import { io } from 'socket.io-client';

import { SocketEvents } from '@/types/socket-events';
import { useSocketContext } from '@/context/socket-context';
import { useLocalStorage } from './use-local-storage';

export const useSocketGameEvents = () => {
	const { socket, connectSocket } = useSocketContext();
	const { get } = useLocalStorage('roomId');

	const initiateConnection = () => {
		const socketConnection = io('http://localhost:3000', {
			// TODO: эти настройки только для dev

			// TODO: на сервере проверять есть ли такой playerId в roomId, полезно в случае потери подключения к игре
			withCredentials: true,
		});

		connectSocket(socketConnection);

		return socketConnection;
	};

	const searchGame = () => {
		let socketConnection = socket;

		if (!socketConnection) {
			socketConnection = initiateConnection();
		}

		socketConnection?.emit(SocketEvents.SEARCH_GAME);
	};

	const attack = (coords: string) => {
		const roomId = get();

		socket?.emit(SocketEvents.ATTACK, { roomId, coords });
	};

	return { searchGame, attack };
};
