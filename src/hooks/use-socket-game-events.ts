import { useCallback } from 'preact/hooks';
import { io } from 'socket.io-client';

import { ClientSocket, SocketEvents } from '@/types/socket';
import { useSocketContext } from '@/context/socket-context';
import { Keys } from '@/constants/locale-storage';
import { SERVER_HOST } from '@/constants/socket';
import { useStoreContext } from '@/context/store-context';
import { useLocalStorage } from './use-local-storage';

export const useSocketGameEvents = () => {
	const { socket, connectSocket } = useSocketContext();
	const { gameStore } = useStoreContext();
	const { get } = useLocalStorage(Keys.ROOM_ID);

	const { invitedByPlayer } = gameStore;

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

	const acceptInvitation = () => {
		const playerId = invitedByPlayer || '';

		socket?.emit(SocketEvents.ACCEPT_INVITATION, playerId);
		gameStore.setInvitedByPlayer(null);
	};

	const rejectInvitation = () => {
		const playerId = invitedByPlayer || '';

		socket?.emit(SocketEvents.REJECT_INVITATION, playerId);
		gameStore.setInvitedByPlayer(null);
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
		acceptInvitation,
		rejectInvitation,
		attack,
	};
};
