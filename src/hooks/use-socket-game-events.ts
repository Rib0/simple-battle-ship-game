import { useCallback } from 'preact/hooks';
import { io } from 'socket.io-client';

import { ClientSocket, SocketEvents } from '@/types/socket';
import { useSocketContext } from '@/context/socket-context';
import { SERVER_HOST } from '@/constants/socket';
import { useStoreContext } from '@/context/store-context';
import { LocaleStorage } from '@/utils/locale-storage';

export const useSocketGameEvents = () => {
	const { socket, connectSocket } = useSocketContext();
	const rootStore = useStoreContext();

	const { gameStore } = rootStore;

	const { invitedByPlayer } = gameStore;

	const initiateSocketConnection = useCallback(() => {
		const playerId = LocaleStorage.get('player_id_battle_ship_game');

		const socketConnection: ClientSocket = io(SERVER_HOST, {
			auth: {
				playerId,
			},
		});

		connectSocket(socketConnection);
	}, [connectSocket]);

	const setAuthData = useCallback(() => {
		socket?.emit(SocketEvents.SET_AUTH_DATA);
	}, [socket]);

	const searchGame = () => {
		socket?.emit(SocketEvents.SEARCH_GAME);
	};

	const findGameToReconnect = useCallback(() => {
		const roomId = LocaleStorage.get('room_id_battle_ship_game');

		if (!roomId) {
			return;
		}

		socket?.emit(SocketEvents.FIND_GAME_TO_RECONNECT, roomId);
	}, [socket]);

	const inviteById = (id: string) => {
		socket?.emit(SocketEvents.INVITE_BY_ID, id);
	};

	const acceptInvitation = () => {
		if (!invitedByPlayer) {
			return;
		}

		socket?.emit(SocketEvents.ACCEPT_INVITATION, invitedByPlayer);
		gameStore.setGameValue('invitedByPlayer', null);
	};

	const rejectInvitation = () => {
		if (!invitedByPlayer) {
			return;
		}

		socket?.emit(SocketEvents.REJECT_INVITATION, invitedByPlayer);
		gameStore.setGameValue('invitedByPlayer', null);
	};

	const attack = (coords: string) => {
		const roomId = LocaleStorage.get('room_id_battle_ship_game');

		if (!roomId) {
			return;
		}

		socket?.emit(SocketEvents.ATTACK, coords, roomId);
	};

	const leaveGame = () => {
		socket?.emit(SocketEvents.PLAYER_LEAVE_GAME);
		LocaleStorage.remove('room_id_battle_ship_game');
		rootStore.createNewStoreData();
	};

	// TODO: отсортировать по событиям socket

	return {
		socket,
		initiateSocketConnection,
		setAuthData,
		searchGame,
		findGameToReconnect,
		inviteById,
		acceptInvitation,
		rejectInvitation,
		attack,
		leaveGame,
	};
};
