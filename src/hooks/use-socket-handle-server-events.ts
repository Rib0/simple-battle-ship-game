import { useEffect } from 'preact/hooks';

import { useStoreContext } from '@/context/store-context';
import { ClientSocket, SocketEvents } from '@/types/socket';
import { CellType } from '@/types/game-field';
import { LocaleStorage } from '@/utils/locale-storage';

export const useSocketHandleServerEvents = (socket?: ClientSocket) => {
	const rootStore = useStoreContext();

	const { gameStore, gameFieldStore } = rootStore;

	useEffect(() => {
		if (!socket) {
			return;
		}

		socket.on(SocketEvents.SET_AUTH_DATA, (playerId) => {
			LocaleStorage.set('player_id_battle_ship_game', playerId);
			gameStore.setGameValue('playerId', playerId);
		});

		socket.on(SocketEvents.TIMER_TICK, (currentTime: number) => {
			if (gameStore.isEnemyOnline) {
				gameStore.setGameValue('currentTime', currentTime);
			}
		});

		socket.on(SocketEvents.INVITE_BY_ID, (id) => {
			if (gameStore.invitedByPlayer) {
				return;
			}

			gameStore.setGameValue('invitedByPlayer', id);
		});

		socket.on(SocketEvents.REJECT_INVITATION, () => {
			gameStore.addNotification('Пользователь отказался от игры');
		});

		socket.on(SocketEvents.NO_PLAYER_TO_INVITE, () => {
			gameStore.addNotification('Такого игрока не существует');
		});

		socket.on(SocketEvents.JOINED_ROOM, (roomId, callback) => {
			const { getField, ships } = gameFieldStore;
			const { setGameValue } = gameStore;

			setGameValue('isStarted', true);
			setGameValue('isEnemyOnline', true);
			LocaleStorage.set('room_id_battle_ship_game', roomId);
			callback({ field: getField, ships });
		});

		socket.on(SocketEvents.RECONNECTED_TO_ROOM, (myGameState, enemyField, isEnemyOnline) => {
			const { setGameValue } = gameStore;
			const { installGameState } = gameFieldStore;

			setGameValue('isStarted', true);
			installGameState(myGameState, enemyField);
			setGameValue('isEnemyOnline', isEnemyOnline);
		});

		socket.on(SocketEvents.ENEMY_RECONNECTED_TO_ROOM, () => {
			gameStore.setGameValue('isEnemyOnline', true);
		});

		socket.on(SocketEvents.ENEMY_DISCONNECTED, () => {
			gameStore.setGameValue('isEnemyOnline', false);
		});

		socket.on(SocketEvents.PLAYER_LEAVE_GAME, () => {
			gameStore.setGameValue('isEnemyOnline', false);
			gameStore.addNotification('Противник покинул игру', rootStore.createNewStoreData);
		});

		socket.on(SocketEvents.CHANGE_TURN, (isMyTurn, turnStartTime) => {
			gameStore.setGameValue('isMyTurn', isMyTurn);
			gameStore.setGameValue('turnStartTime', turnStartTime);
		});

		socket.on(SocketEvents.DAMAGED, (coords, isMe) => {
			gameFieldStore.setCellType(coords, isMe, CellType.DAMAGED);
		});

		socket.on(SocketEvents.MISSED, (coords, isMe) => {
			gameFieldStore.setCellType(coords, isMe, CellType.BOMB);
		});
	}, [socket, gameStore, gameFieldStore, rootStore]);
};
