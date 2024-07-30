import { getCellsCoordsAroundShip, parseCoords } from '@/utils/table';
import { getShipCoords } from '@/utils/ship';
import { CellType, Field, GameFieldShips } from '@/types/game-field';
import { ShipRotation, ShipSize } from '@/types/ship';
import { ServerSocket, SocketEvents } from '@/types/socket';
import { Nullable } from '@/types/utils';
import { delay, getPlayerId } from './utils';
import { ServerState } from '../server-state';

type Data = {
	field: Field;
	ships: GameFieldShips;
	damagedCoords: string;
	socket: ServerSocket;
	enemySocket: ServerSocket;
	roomId: string;
};

export const destroyCoordsAroundShipIfNeeded = async (data: Data) => {
	const { field, ships, damagedCoords, socket, enemySocket, roomId } = data;

	let killedShip: Nullable<{
		initialCoords: string;
		coords: string[];
		size: ShipSize;
		rotation: ShipRotation;
	}> = null;

	// eslint-disable-next-line no-restricted-syntax
	for (const ship of Object.entries(ships)) {
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
			shipCoords.every((coord) => field[coord] === CellType.DAMAGED);

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

	const playerId = getPlayerId(socket);
	const enemyPlayerId = getPlayerId(enemySocket);

	if (!playerId || !enemyPlayerId) {
		return;
	}

	const enemyKilledShip = {
		[initialCoords]: { size, rotation },
	};

	ServerState.setPlayerData({
		roomId,
		playerId,
		playerData: { enemiesKilledShips: enemyKilledShip },
	});
	socket.emit(SocketEvents.UPDATE_ENEMIES_KILLED_SHIPS, enemyKilledShip);

	ServerState.setPlayerData({
		roomId,
		playerId: enemyPlayerId,
		playerData: { killedShipsInitialCoords: initialCoords },
	});
	enemySocket.emit(SocketEvents.UPDATE_KILLED_SHIPS_INITIAL_COORDS, initialCoords);

	const coordsAroundKilledShip = getCellsCoordsAroundShip({
		shipCoords: coords,
		shipSize: size,
		shipRotation: rotation,
	});

	// eslint-disable-next-line no-restricted-syntax
	for (const coordAround of coordsAroundKilledShip) {
		// чтобы предотвратить нажатие на ячейки вокруг убитого корабля
		if (field[coordAround] === CellType.BOMB) {
			// eslint-disable-next-line no-continue
			continue;
		}
		field[coordAround] = CellType.DAMAGED;
	}

	// eslint-disable-next-line no-restricted-syntax
	for (const coordAround of coordsAroundKilledShip) {
		if (field[coordAround] === CellType.BOMB) {
			// eslint-disable-next-line no-continue
			continue;
		}
		field[coordAround] = CellType.DAMAGED;
		socket.emit(SocketEvents.DAMAGED, coordAround, false);
		socket.to(roomId).emit(SocketEvents.DAMAGED, coordAround, true);
		// eslint-disable-next-line no-await-in-loop
		await delay(150);
	}
};
