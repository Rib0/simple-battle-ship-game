import { useCallback } from 'preact/hooks';

import { SocketEvents } from '@/types/socket';
import { useSocketContext } from '@/context/socket-context';
import { useStoreContext } from '@/context/store-context';
import { LocaleStorage } from '@/utils/locale-storage';

export const useSocketGameEvents = () => {
	const { socket } = useSocketContext();
	const rootStore = useStoreContext();

	const { gameStore } = rootStore;

	const getUsersOnline = useCallback(() => {
		socket?.emit(SocketEvents.GET_USERS_ONLINE);
	}, [socket]);

	const setAuthData = useCallback(() => {
		socket?.emit(SocketEvents.SET_AUTH_DATA);
	}, [socket]);

	const searchGame = () => {
		socket?.emit(SocketEvents.SEARCH_GAME);
		gameStore.setGameValue('isSearching', true);
	};

	const cancelSearchGame = () => {
		socket?.emit(SocketEvents.CANCEL_SEARCH_GAME);
		gameStore.setGameValue('isSearching', false);
	};

	const inviteById = (id: string) => {
		socket?.emit(SocketEvents.INVITE_BY_ID, id);
	};

	const acceptInvitation = () => {
		const { invitedByPlayerId } = gameStore;
		if (!invitedByPlayerId) {
			return;
		}

		socket?.emit(SocketEvents.ACCEPT_INVITATION, invitedByPlayerId);
		gameStore.setGameValue('invitedByPlayerId', null);
	};

	const rejectInvitation = () => {
		const { invitedByPlayerId } = gameStore;
		if (!invitedByPlayerId) {
			return;
		}

		socket?.emit(SocketEvents.REJECT_INVITATION, invitedByPlayerId);
		gameStore.setGameValue('invitedByPlayerId', null);
	};

	const findGameToReconnect = useCallback(() => {
		const roomId = LocaleStorage.get('room_id_battle_ship_game');

		if (!roomId) {
			return;
		}

		socket?.emit(SocketEvents.FIND_GAME_TO_RECONNECT, roomId);
	}, [socket]);

	const leaveGame = () => {
		socket?.emit(SocketEvents.PLAYER_LEAVE_GAME);
		LocaleStorage.remove('room_id_battle_ship_game');
		rootStore.resetAllGameStores();
	};

	const attack = (coords: string) => {
		const roomId = LocaleStorage.get('room_id_battle_ship_game');

		if (!roomId) {
			return;
		}

		socket?.emit(SocketEvents.ATTACK, coords, roomId);
	};

	return {
		setAuthData,
		getUsersOnline,
		searchGame,
		cancelSearchGame,
		inviteById,
		acceptInvitation,
		rejectInvitation,
		findGameToReconnect,
		leaveGame,
		attack,
	};
};
