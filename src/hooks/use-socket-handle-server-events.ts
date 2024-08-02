import { useEffect } from 'preact/hooks';

import { useStoreContext } from '@/context/store-context';
import { ClientSocket, SocketEvents } from '@/types/socket';
import { CellType } from '@/types/game-field';
import { LocaleStorage } from '@/utils/locale-storage';

export const useSocketHandleServerEvents = (socket?: ClientSocket) => {
	const rootStore = useStoreContext();

	const { gameStore, gameFieldStore, shipsStore } = rootStore;

	useEffect(() => {
		if (!socket) {
			return;
		}

		socket.on(SocketEvents.ERROR, (message) => {
			gameStore.addNotification({ message, type: 'error' });
		});

		socket.on(SocketEvents.WARNING, (message) => {
			gameStore.addNotification({ message, type: 'warning' });
		});

		socket.on(SocketEvents.SET_AUTH_DATA, (playerId) => {
			LocaleStorage.set('player_id_battle_ship_game', playerId);
			gameStore.setGameValue('playerId', playerId);
		});

		socket.on(SocketEvents.SET_AUTH_DATA, (playerId) => {
			LocaleStorage.set('player_id_battle_ship_game', playerId);
			gameStore.setGameValue('playerId', playerId);
		});

		socket.on(SocketEvents.TIMER_TICK, () => {
			if (gameStore.isEnemyOnline && !gameStore.isPaused) {
				gameStore.decreaseTimeRemain();
			}
		});

		socket.on(SocketEvents.INVITE_BY_ID, (id) => {
			gameStore.setGameValue('invitedByPlayerId', id);

			setTimeout(() => {
				gameStore.setGameValue('invitedByPlayerId', null);
			}, 10_000);
		});

		socket.on(SocketEvents.INVITATION_FAILED, () => {
			gameStore.setGameValue('isAwaitingInvitationResponse', false);
		});

		socket.on(SocketEvents.JOINED_ROOM, (roomId, callback) => {
			const { getField, ships } = gameFieldStore;

			shipsStore.setActiveSize(null);
			gameStore.setGameValue('isStarted', true);
			gameStore.setGameValue('isEnemyOnline', true);
			LocaleStorage.set('room_id_battle_ship_game', roomId);
			callback({ field: getField, ships });
		});

		socket.on(SocketEvents.RECONNECTED_TO_ROOM, (myGameState, enemyField, isEnemyOnline) => {
			gameStore.setGameValue('isStarted', true);
			gameFieldStore.installGameState(myGameState, enemyField);
			gameStore.setGameValue('isEnemyOnline', isEnemyOnline);
		});

		socket.on(SocketEvents.ENEMY_RECONNECTED_TO_ROOM, () => {
			gameStore.setGameValue('isEnemyOnline', true);
		});

		socket.on(SocketEvents.ENEMY_DISCONNECTED, () => {
			gameStore.setGameValue('isEnemyOnline', false);
		});

		socket.on(SocketEvents.PLAYER_LEAVE_GAME, () => {
			gameStore.setGameValue('isEnemyOnline', false);
			LocaleStorage.remove('room_id_battle_ship_game');
			gameStore.addNotification(
				{ message: 'Противник покинул игру', type: 'warning' },
				rootStore.resetAllStores,
			);
		});

		socket.on(SocketEvents.CHANGE_TURN, (isMyTurn, timeRemain) => {
			gameStore.setGameValue('isMyTurn', isMyTurn);
			gameStore.setGameValue('timeRemain', timeRemain);
		});

		socket.on(SocketEvents.DAMAGED, (coords, isMe) => {
			gameFieldStore.setCellType(coords, isMe, CellType.DAMAGED);
		});

		socket.on(SocketEvents.MISSED, (coords, isMe) => {
			gameFieldStore.setCellType(coords, isMe, CellType.BOMB);
		});

		socket.on(SocketEvents.UPDATE_KILLED_SHIPS_INITIAL_COORDS, (killedShipsInitialCoords) => {
			gameFieldStore.updateKilledShipsInitialsCoords(killedShipsInitialCoords);
		});

		socket.on(SocketEvents.UPDATE_ENEMY_KILLED_SHIPS, (enemyKilledShips) => {
			gameFieldStore.updateEnemyKilledShipsInitialsCoords(enemyKilledShips);
		});

		socket.on(SocketEvents.PLAYER_WON, (isMe) => {
			const message = isMe ? 'Вы выиграли' : 'Вы проиграли';
			const type = isMe ? 'success' : 'warning';

			LocaleStorage.remove('room_id_battle_ship_game');
			gameStore.setGameValue('isPaused', true);
			gameStore.addNotification({ message, type }, rootStore.resetAllStores);
		});
	}, [socket, gameStore, gameFieldStore, shipsStore, rootStore]);
};
