import { useEffect } from 'preact/hooks';

import { useStoreContext } from '@/context/store-context';
import { ClientSocket, SocketEvents } from '@/types/socket';
import { CellType } from '@/types/game-field';
import { LocaleStorage } from '@/utils/locale-storage';

export const useSocketHandleServerEvents = (socket?: ClientSocket) => {
	const { gameStore, gameFieldStore } = useStoreContext();

	useEffect(() => {
		if (!socket) {
			return;
		}

		socket.on(SocketEvents.SET_AUTH_DATA, (playerId) => {
			LocaleStorage.set('player_id_battle_ship_game', playerId);
			gameStore.setPlayerId(playerId);
		});

		socket.on(SocketEvents.TIMER_TICK, () => {});

		socket.on(SocketEvents.INVITE_BY_ID, (id) => {
			if (gameStore.invitedByPlayer) {
				return;
			}

			gameStore.setInvitedByPlayer(id);
		});

		socket.on(SocketEvents.REJECT_INVITATION, () => {
			alert('отказ');
		});

		socket.on(SocketEvents.JOINED_ROOM, (roomId, callback) => {
			const { getField, ships } = gameFieldStore;
			const { setIsStarted, setIsEnemyOnline } = gameStore;

			setIsStarted(true);
			setIsEnemyOnline(true);
			LocaleStorage.set('room_id_battle_ship_game', roomId);
			callback({ field: getField, ships });
		});

		socket.on(SocketEvents.RECONNECTED_TO_ROOM, (myGameState, enemyField, isEnemyOnline) => {
			const { setIsStarted, setIsEnemyOnline } = gameStore;
			const { installGameState } = gameFieldStore;

			setIsStarted(true);
			installGameState(myGameState, enemyField);
			setIsEnemyOnline(isEnemyOnline);
		});

		socket.on(SocketEvents.ENEMY_RECONNECTED_TO_ROOM, () => {
			gameStore.setIsEnemyOnline(true);
		});
		socket.on(SocketEvents.ENEMY_DISCONNECTED, () => {
			gameStore.setIsEnemyOnline(false);
		});

		socket.on(SocketEvents.CHANGE_TURN, (value) => {
			// console.log('CHANGE_TURN');
			// console.log(value);
		});

		socket.on(SocketEvents.DAMAGED, (coords, isMe) => {
			gameFieldStore.setCellType(coords, isMe, CellType.DAMAGED);
		});

		socket.on(SocketEvents.MISSED, (coords, isMe) => {
			gameFieldStore.setCellType(coords, isMe, CellType.BOMB);
		});
	}, [socket, gameStore, gameFieldStore]);
};
