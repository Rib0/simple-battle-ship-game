import { nanoid } from 'nanoid';
import { IoConnection } from './lib/io-connection';
import { Timer } from './lib/timer';
import { Utils } from './lib/utils';
import { registerHandlers } from './handlers/register-handlers';

export class Server {
	static io = IoConnection.getInstance().connection;

	private static registerMiddlewares() {
		const { io } = Server;

		io.use((socket, next) => {
			const playerId = Utils.getPlayerId(socket) || '';
			const socketWithEqualPlayerId = Utils.findSocketByPlayerId(playerId);

			if ((socketWithEqualPlayerId && socketWithEqualPlayerId !== socket) || !playerId) {
				const newPlayerId = nanoid();
				Utils.setPlayerId(socket, newPlayerId);
			}

			next();
		});
	}

	private static registerHandlers() {
		const { io } = Server;

		io.on('connection', (socket) => {
			registerHandlers(io, socket);
		});
	}

	static start() {
		const { io } = Server;

		io.listen(3001);

		Timer.start(io);
		this.registerMiddlewares();
		this.registerHandlers();
	}
}
