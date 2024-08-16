import { Socket } from 'socket.io';

import { CellType, Field, GameFieldShips } from '@/types/game-field';
import { SocketEvents } from '@/types/socket';
import { Utils } from '../lib/utils';

export class Player {
	// eslint-disable-next-line no-useless-constructor
	constructor(
		public socketId: Socket['id'],
		public enemyPlayerId: string,
		public field: Field,
		public ships: GameFieldShips,
		public killedShipsInitialCoords: string[] = [],
		public enemyKilledShips: GameFieldShips = {},
		public disconnectedTime?: number,
		// eslint-disable-next-line no-empty-function
	) {}

	get socket() {
		return Utils.findSocketBySocketId(this.socketId);
	}

	get id() {
		if (!this.socket) {
			return undefined;
		}

		return Utils.getPlayerId(this.socket);
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
