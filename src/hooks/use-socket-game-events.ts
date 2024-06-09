import { useCallback } from 'preact/hooks';
import { io } from 'socket.io-client';

import { ClientSocket, SocketEvents } from '@/types/socket';
import { useSocketContext } from '@/context/socket-context';
import { KEYS } from '@/constants/locale-storage';
import { SERVER_HOST } from '@/constants/socket';
import { useLocalStorage } from './use-local-storage';

export const useSocketGameEvents = () => {
	const { socket, connectSocket } = useSocketContext();
	const { get } = useLocalStorage(KEYS.ROOM_ID);

	const initiateSocketConnection = useCallback(() => {
		const socketConnection: ClientSocket = io(SERVER_HOST, {
			withCredentials: true,
		});

		connectSocket(socketConnection);
	}, [connectSocket]);

	const searchGame = () => {
		socket?.emit(SocketEvents.SEARCH_GAME);
	};

	const findGameToReconnect = () => {
		const roomId = get() || '';

		socket?.emit(SocketEvents.FIND_GAME_TO_RECONNECT, roomId);
	};

	const inviteById = (id: string) => {
		socket?.emit(SocketEvents.INVITE_BY_ID, id);
	};

	const attack = (coords: string) => {
		const roomId = get() || '';

		socket?.emit(SocketEvents.ATTACK, coords, roomId);
	};

	return {
		socket,
		initiateSocketConnection,
		searchGame,
		findGameToReconnect,
		inviteById,
		attack,
	};
};
