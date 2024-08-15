import { nanoid } from 'nanoid';

import { SocketEvents } from '@/types/socket';
import { TURN_DURATION } from '@/constants/game';
import { CellType } from '@/types/game-field';
import { Nullable } from '@/types/utils';
import { ShipRotation, ShipSize } from '@/types/ship';
import { getCellsCoordsAroundShip, parseCoords } from '@/utils/table';
import { getShipCoords } from '@/utils/ship';
import { Player } from './player';
import { Timer } from '../lib/timer';
import { IoConnection } from '../lib/io-connection';
import { roomStore } from '../stores/rooms-store';
import { Utils } from '../lib/utils';

/* 
	TODO:
	1. Проверить на обязательность всех полей в классах
*/

export class Room {
	private ioConnection = IoConnection.getInstance().connection;

	readonly id: string;

	turnStartTime?: number;

	turnPlayerId?: string;

	turnId?: string; // TODO: мб сделать private

	players: Map<string, Player> = new Map();

	constructor() {
		const roomId = nanoid();

		this.id = roomId;
	}

	isValidTurn(playerId?: string): playerId is string {
		return this.turnPlayerId === playerId;
	}

	getPlayer(id: string) {
		return this.players.get(id);
	}

	getEnemyToPlayer(id: string) {
		const players = [...this.players.values()];

		const enemyPlayer = players.find((player) => player.id !== id);

		return enemyPlayer;
	}

	addPlayers(
		playersData: Array<{
			id: string;
			data: Pick<Player, 'socketId' | 'enemyPlayerId' | 'field' | 'ships'>;
		}>,
	) {
		playersData.forEach(({ id, data }) => {
			const player = new Player(data.socketId, data.enemyPlayerId, data.field, data.ships);

			this.players.set(id, player);
		});
	}

	changeTurn(reconnectedPlayerId?: string) {
		// TODO: мб отрефакторить в будущем
		const [player1, player2] = [...this.players.values()];

		const playersSockets = [player1.socket, player2.socket];

		const hasDisconnected = playersSockets.some((socket) => socket?.disconnected);
		const isLeavedRoom = playersSockets.some((socket) => socket?.data.roomId !== this.id);

		if (hasDisconnected || isLeavedRoom) {
			return;
		}

		if (!player1.id || !player2.id) {
			return;
		}

		const prevTurnPlayerId = this.turnPlayerId;
		const isPlayer1PrevTurn = prevTurnPlayerId === player1.id;
		const nextTurn = {
			id: nanoid(),
			playerId: isPlayer1PrevTurn ? player2.id : player1.id,
			startTime: Timer.getTime,
		};

		let changeTurnCallbackDelay = TURN_DURATION;

		const changeTurnWithTime = (timeRemain: number, keepTurn?: boolean) => {
			if (!keepTurn) {
				this.turnPlayerId = nextTurn.playerId;
			}

			this.turnId = nextTurn.id;
			this.turnStartTime = nextTurn.startTime;

			const playerIdToUpdate =
				keepTurn && prevTurnPlayerId ? prevTurnPlayerId : nextTurn.playerId;
			const player = this.getPlayer(playerIdToUpdate);

			if (!player) {
				return;
			}

			player.timeRemain = timeRemain;

			if (keepTurn) {
				changeTurnCallbackDelay = timeRemain;
			}

			player1.socket?.emit(
				SocketEvents.CHANGE_TURN,
				keepTurn ? isPlayer1PrevTurn : !isPlayer1PrevTurn,
				timeRemain,
			);
			player2.socket?.emit(
				SocketEvents.CHANGE_TURN,
				keepTurn ? !isPlayer1PrevTurn : isPlayer1PrevTurn,
				timeRemain,
			);
		};

		if (!reconnectedPlayerId) {
			changeTurnWithTime(TURN_DURATION);
		} else {
			const isReconnectedPlayerTurn = reconnectedPlayerId === prevTurnPlayerId;

			if (isReconnectedPlayerTurn) {
				const player = this.getPlayer(reconnectedPlayerId);

				if (!player) {
					return;
				}

				const { timeRemain = TURN_DURATION } = player;

				if (timeRemain <= 0) {
					changeTurnWithTime(TURN_DURATION);
				} else {
					changeTurnWithTime(timeRemain, true);
				}
			} else {
				changeTurnWithTime(TURN_DURATION, true);
			}
		}

		const delayedChangeTurnCallback = () => {
			const isStaleTurnId = this.turnId !== nextTurn.id;
			const hasDisconnectedActual = playersSockets.some((socket) => socket?.disconnected);
			const isLeavedRoomActual = playersSockets.some(
				(socket) => socket?.data.roomId !== this.id,
			);

			if (isStaleTurnId || hasDisconnectedActual || isLeavedRoomActual) {
				return;
			}

			this.changeTurn();
		};

		Timer.addCallback(delayedChangeTurnCallback, changeTurnCallbackDelay);
	}

	async handleDestroyedShip(damagedCoords: string) {
		if (!this.turnPlayerId) {
			return;
		}

		const attacker = this.getPlayer(this.turnPlayerId);
		const awaiter = this.getEnemyToPlayer(this.turnPlayerId);

		if (!attacker || !awaiter) {
			return;
		}

		let killedShip: Nullable<{
			initialCoords: string;
			coords: string[];
			size: ShipSize;
			rotation: ShipRotation;
		}> = null;

		// eslint-disable-next-line no-restricted-syntax
		for (const ship of Object.entries(awaiter.ships)) {
			const [initialCoords, { size: shipSize, rotation: shipRotation }] = ship;

			const [[xFirstCellCoord, yFirstCellCoord]] = parseCoords(initialCoords);

			const shipCoords = getShipCoords({
				xFirstCellCoord,
				yFirstCellCoord,
				shipSize,
				shipRotation,
			});
			const isKilledShip =
				shipCoords.includes(damagedCoords) &&
				shipCoords.every((coord) => awaiter.field[coord] === CellType.DAMAGED);

			if (isKilledShip) {
				killedShip = {
					initialCoords,
					coords: shipCoords,
					size: shipSize,
					rotation: shipRotation,
				};

				break;
			}
		}

		if (!killedShip) {
			return;
		}

		const { initialCoords, coords, size, rotation } = killedShip;

		const enemyKilledShip = {
			[initialCoords]: { size, rotation },
		};

		attacker.enemyKilledShips = { ...attacker.enemyKilledShips, ...enemyKilledShip };
		attacker.socket?.emit(SocketEvents.UPDATE_ENEMY_KILLED_SHIPS, enemyKilledShip);

		awaiter.killedShipsInitialCoords = awaiter.killedShipsInitialCoords?.concat(initialCoords);
		awaiter.socket?.emit(SocketEvents.UPDATE_KILLED_SHIPS_INITIAL_COORDS, initialCoords);

		const coordsAroundKilledShip = getCellsCoordsAroundShip({
			shipCoords: coords,
			shipSize: size,
			shipRotation: rotation,
			withShipCoords: false,
		});
		const coordsAroundKilledShipForDestroy = coordsAroundKilledShip.filter(
			(coord) => ![CellType.BOMB, CellType.DAMAGED].includes(awaiter.field[coord]),
		);

		// eslint-disable-next-line no-restricted-syntax
		for (const coordAround of coordsAroundKilledShipForDestroy) {
			// чтобы предотвратить нажатие на ячейки вокруг убитого корабля
			awaiter.field[coordAround] = CellType.DAMAGED;
		}

		// eslint-disable-next-line no-restricted-syntax
		for (const coordAround of coordsAroundKilledShipForDestroy) {
			// eslint-disable-next-line no-await-in-loop
			await Utils.delay(150);
			attacker.socket?.emit(SocketEvents.DAMAGED, coordAround, false);
			awaiter.socket?.emit(SocketEvents.DAMAGED, coordAround, true);
		}
	}

	get isGameOver() {
		if (!this.turnPlayerId) {
			return false;
		}

		const player = this.getEnemyToPlayer(this.turnPlayerId);

		const result = Object.values(player?.field || {}).every((cell) => cell !== CellType.SHIP);
		return result;
	}

	handleGameOver() {
		if (!this.turnPlayerId) {
			return;
		}

		if (this.isGameOver) {
			const winner = this.getPlayer(this.turnPlayerId);
			const looser = this.getEnemyToPlayer(this.turnPlayerId);

			winner?.socket?.emit(SocketEvents.PLAYER_WON, true);
			looser?.socket?.emit(SocketEvents.PLAYER_WON, false);

			if (winner?.socket?.data) {
				winner.socket.data = {};
			}

			if (looser?.socket?.data) {
				looser.socket.data = {};
			}

			this.ioConnection.socketsLeave(this.id);
			roomStore.deleteRoom(this.id);
		}
	}
}
