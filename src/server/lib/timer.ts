import { ServerIo, SocketEvents } from '@/types/socket';

export class Timer {
	private static timerId: NodeJS.Timeout | null = null;

	private static callbacks: Record<string, VoidFunction[]> = {};

	static get getTime() {
		return Math.ceil(new Date().getTime() / 1000);
	}

	static start(io: ServerIo) {
		if (Timer.timerId) {
			return;
		}

		Timer.timerId = setInterval(() => {
			io.emit(SocketEvents.TIMER_TICK);
			Timer.triggerCallbacks();
		}, 1000);
	}

	// delay в секундах
	static addCallback(callback: VoidFunction, delay: number) {
		const now = Timer.getTime;
		const triggerTime = now + delay;

		if (Timer.callbacks[triggerTime]) {
			Timer.callbacks[triggerTime].push(callback);
		} else {
			Timer.callbacks[triggerTime] = [callback];
		}
	}

	private static triggerCallbacks() {
		const timesToTrigger = Object.keys(Timer.callbacks);

		if (!timesToTrigger.length) {
			return;
		}

		const now = Timer.getTime;
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
}
