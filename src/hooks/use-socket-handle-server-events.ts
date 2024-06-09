import { useEffect } from 'preact/hooks';

import { useStoreContext } from '@/context/store-context';
import { ClientSocket, GameState, SocketEvents } from '@/types/socket';
import { CellType, Field } from '@/types/game-field';
import { KEYS } from '@/constants/locale-storage';
import { useLocalStorage } from './use-local-storage';

export const useSocketHandleServerEvents = (socket?: ClientSocket) => {
	const { gameStore, gameFieldStore } = useStoreContext();
	const { set } = useLocalStorage(KEYS.ROOM_ID);

	useEffect(() => {
		if (!socket) {
			return;
		}

		socket.on(SocketEvents.TIMER_TICK, () => {});

		socket.on(SocketEvents.INVITED, (id) => {
			alert(id);
		});

		socket.on(
			SocketEvents.JOINED_ROOM,
			(roomId: string, callback: ({ field, ships }: GameState) => void) => {
				const { getField, ships } = gameFieldStore;
				const { setIsStarted, setIsEnemyOnline } = gameStore;

				setIsStarted(true);
				setIsEnemyOnline(true);
				set(roomId);
				callback({ field: getField, ships });
			},
		);

		socket.on(
			SocketEvents.RECONNECTED_TO_ROOM,
			(myGameState: GameState, enemyField: Field, isEnemyOnline) => {
				const { setIsStarted, setIsEnemyOnline } = gameStore;
				const { installGameState } = gameFieldStore;

				setIsStarted(true);
				installGameState(myGameState, enemyField);
				setIsEnemyOnline(isEnemyOnline);
			},
		);

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
	}, [socket, set, gameStore, gameFieldStore]);
};
