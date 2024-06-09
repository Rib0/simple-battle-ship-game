import { computed, makeAutoObservable } from 'mobx';

import { ShipRotation, ShipSize } from '@/types/ship';
import {
	getCellsCoordsAroundShip,
	getInactiveCellCoordsForInstallWithShipRotation,
	parseCoords,
} from '@/utils/table';
import { Nullable } from '@/types/utils';
import { Field, CellType, GameFieldShips } from '@/types/game-field';
import { GameState } from '@/types/socket';
import { getRandomlyInstalledShips, getShipCoords } from '@/utils/ship';
import { RootStore } from './root';

export class GameFieldStore {
	private store: RootStore;

	ships: GameFieldShips = {};

	activeInstalledShipCoords: Nullable<string> = null;

	private field: Field = {};

	private enemyField: Field = {};

	private inactiveCoordsForInstall = new Set<string>();

	constructor(store: RootStore) {
		makeAutoObservable(this, {
			getInactiveCoordsForInstall: computed.struct, // пересчитывает значение и если оно равно предыдущему не перерендеривает observers где есть этот getter
		});

		this.store = store;
	}

	get getInactiveCoordsForInstall() {
		const { activeSize, activeSizeRotation } = this.store.shipsStore;

		if (!activeSize) {
			return this.inactiveCoordsForInstall;
		}

		return getInactiveCellCoordsForInstallWithShipRotation({
			shipSize: activeSize,
			shipRotation: activeSizeRotation,
			inactiveCoordsForInstall: this.inactiveCoordsForInstall,
		});
	}

	installShip = ({
		shipCoords,
		shipRotation,
		shipSize,
	}: {
		shipCoords: string[];
		shipRotation: ShipRotation;
		shipSize: ShipSize;
	}) => {
		const [initialCoords] = shipCoords;

		this.ships[initialCoords] = {
			rotation: shipRotation,
			size: shipSize,
		};

		shipCoords.forEach((coord) => {
			this.field[coord] = CellType.SHIP;
		});

		const inactiveCoords = getCellsCoordsAroundShip({ shipCoords, shipRotation, shipSize });
		inactiveCoords.forEach((coord) => this.inactiveCoordsForInstall.add(coord));

		this.store.shipsStore.decreaseShipAmount(shipSize);
		this.store.shipsStore.setActiveSize(null);
	};

	resetAllShips = () => {
		this.ships = {};
		this.field = {};
		this.inactiveCoordsForInstall = new Set();
		this.store.shipsStore.resetShipAmount();
	};

	randomlyInstallShips = () => {
		this.resetAllShips();
		getRandomlyInstalledShips().forEach((shipData) => this.installShip(shipData));
	};

	setActiveInstalledShip = (shipCoords: Nullable<string>) => {
		this.activeInstalledShipCoords = shipCoords;
	};

	removeActiveInstalledShip = () => {
		const shipInitialCoords = this.activeInstalledShipCoords!;
		const { size: shipSize, rotation: shipRotation } = this.ships[shipInitialCoords];
		const [[xFirstCellCoord, yFirstCellCoord]] = parseCoords(shipInitialCoords);
		const shipCoordsForDelete = getShipCoords({
			xFirstCellCoord,
			yFirstCellCoord,
			shipSize,
			shipRotation,
		});
		const cellsCoordsAroundShip = getCellsCoordsAroundShip({
			shipCoords: shipCoordsForDelete,
			shipRotation,
			shipSize,
		});

		shipCoordsForDelete.forEach((coord) => {
			delete this.field[coord];
		});
		cellsCoordsAroundShip.forEach((coord) => this.inactiveCoordsForInstall.delete(coord));

		delete this.ships[this.activeInstalledShipCoords!];
		this.setActiveInstalledShip(null);
		this.store.shipsStore.increaseShipAmount(shipSize);
	};

	installGameState = (myGameState: GameState, enemyField: Field) => {
		const { field, ships } = myGameState;

		this.ships = ships;
		this.field = field;

		this.enemyField = enemyField;
	};

	get getField() {
		return this.field;
	}

	setCellType = (coords: string, isMe: boolean, cellType: CellType) => {
		const fieldName = isMe ? 'field' : 'enemyField';

		this[fieldName][coords] = cellType;
	};

	canAttackEnemyCell = (coords: string) => {
		const cell = this.enemyField[coords];

		return ![CellType.BOMB, CellType.DAMAGED].includes(cell);
	};

	getCellType = (coords: string, isMe: boolean) => {
		const fieldName = isMe ? 'field' : 'enemyField';

		return this[fieldName][coords] || '';
	};
}
