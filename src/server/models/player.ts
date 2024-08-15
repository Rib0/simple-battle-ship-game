import { Socket } from 'socket.io';

import { CellType, Field, GameFieldShips } from '@/types/game-field';
import { ServerSocket, SocketEvents } from '@/types/socket';
import { IoConnection } from '../lib/io-connection';

export class Player {
	private ioConnection = IoConnection.getInstance().connection;
	// TODO: перенести сюда методы по поиску сокетов по id и тд из Utils

	// eslint-disable-next-line no-useless-constructor
	constructor(
		public socketId: Socket['id'],
		public enemyPlayerId: string,
		public field: Field,
		public ships: GameFieldShips,
		public timeRemain?: number,
		public killedShipsInitialCoords: string[] = [],
		public enemyKilledShips: GameFieldShips = {},
		public disconnectedTime?: number,
		// eslint-disable-next-line no-empty-function
	) {}

	get socket(): ServerSocket | undefined {
		return this.ioConnection.of('/').sockets.get(this.socketId);
	}

	get id() {
		return this.socket?.handshake.auth.playerId as string | undefined;
	}

	isInactiveCoords(coords: string) {
		return [CellType.BOMB, CellType.DAMAGED].includes(this.field[coords]);
	}

	isDamagedCoords(coords: string) {
		return this.field[coords] === CellType.SHIP;
	}

	attack(enemyPlayer: Player, coords: string) {
		const isDamaged = enemyPlayer.isDamagedCoords(coords);
		const eventType = isDamaged ? SocketEvents.DAMAGED : SocketEvents.MISSED;

		enemyPlayer.field[coords] = isDamaged ? CellType.DAMAGED : CellType.BOMB;

		this.socket?.emit(eventType, coords, false);
		enemyPlayer.socket?.emit(eventType, coords, true);

		return isDamaged;
	}
}
