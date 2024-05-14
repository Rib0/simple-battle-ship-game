import { useEffect } from 'preact/hooks';
import { Socket } from 'socket.io-client';

import { useStoreContext } from '@/context/store-context';
import { SocketEvents } from '@/types/socket-events';
import { Field } from '@/types/game-field';
import { useLocalStorage } from './use-local-storage';

export const useSocketHandleServerEvents = (socket?: Socket) => {
	const { gameStore, gameFieldStore } = useStoreContext();
	const { set } = useLocalStorage('roomId');

	useEffect(() => {
		if (!socket) {
			return;
		}

		socket.on(SocketEvents.TIMER_TICK, () => {
			console.log('tick');
		});

		socket.on(SocketEvents.JOINED_ROOM, (roomId: string, callback: (field: Field) => void) => {
			gameStore.setIsStarted(true);
			set(roomId);
			callback(gameFieldStore.getField);
		});

		socket.on(SocketEvents.ATTACK, (coords: string) => {});

		socket.on(SocketEvents.DAMAGED, (coords: string) => {});
	}, [socket, set, gameStore, gameFieldStore]);
};
