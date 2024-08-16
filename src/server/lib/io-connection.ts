import { Server } from 'socket.io';

import { ServerIo } from '@/types/socket';

export class IoConnection {
	// eslint-disable-next-line no-use-before-define
	private static instance: IoConnection;

	readonly connection: ServerIo;

	private constructor() {
		this.connection = new Server({
			cors: {
				origin: 'http://localhost:8080', // TODO: сделать только для дева исользовать donteenv для разных сред, перенести хост в переменные
			},
		});
	}

	static getInstance() {
		if (!this.instance) {
			this.instance = new IoConnection();
		}

		return this.instance;
	}
}
