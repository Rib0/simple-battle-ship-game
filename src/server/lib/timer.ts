import { Server } from 'socket.io';

import { SocketEvents } from '@/types/socket-events';

export class Timer {
	private static timerId: NodeJS.Timeout | null = null;

	private static callbacks: Record<string, VoidFunction[]> = {};

	static start(io: Server) {
		if (Timer.timerId) {
			return;
		}

		Timer.timerId = setInterval(() => {
			io.emit(SocketEvents.TIMER_TICK);
			Timer.triggerCallbacks();
		}, 1000);
	}

	static stop() {
		if (Timer.timerId) {
			clearInterval(Timer.timerId);
			Timer.timerId = null;
		}
	}

	static addCallback(callback: VoidFunction, delay: number) {
		const now = new Date().getTime();
		const triggerTime = now + delay;

		if (Timer.callbacks[triggerTime]) {
			Timer.callbacks[triggerTime].push(callback);
		} else {
			Timer.callbacks[triggerTime] = [callback];
		}
	}

	private static triggerCallbacks() {
		const now = new Date().getTime();
		const timesToTrigger = Object.keys(Timer.callbacks);

		if (!timesToTrigger.length) {
			return;
		}

		const callbacksKeysToTrigger = timesToTrigger.filter((time) => now >= Number(time));

		if (!callbacksKeysToTrigger.length) {
			return;
		}

		const callbacks: VoidFunction[] = [];

		callbacksKeysToTrigger.forEach((key) => {
			callbacks.push(...Timer.callbacks[key]);
			delete Timer.callbacks[key];
		});

		callbacks.forEach((callback) => callback());
	}

	static get getTimerId() {
		return Timer.timerId;
	}
}
