import { useCallback } from 'preact/hooks';

import { SocketEvents } from '@/types/socket';
import { useSocketContext } from '@/context/socket-context';
import { useStoreContext } from '@/context/store-context';
import { LocaleStorage } from '@/utils/locale-storage';

export const useSocketGameEvents = () => {
	const { socket } = useSocketContext();
	const rootStore = useStoreContext();

	const { gameStore } = rootStore;

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
		gameStore.setGameValue('isAwaitingInvitationResponse', true);
	};

	const acceptInvitation = () => {
		socket?.emit(SocketEvents.ACCEPT_INVITATION);
		gameStore.setGameValue('invitedByPlayerId', null);
	};

	const rejectInvitation = () => {
		socket?.emit(SocketEvents.REJECT_INVITATION);
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
		rootStore.resetAllStores();
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
