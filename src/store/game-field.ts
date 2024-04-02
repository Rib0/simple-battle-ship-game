import { makeAutoObservable } from 'mobx';

import { ShipRotation, ShipSize } from '@/types/ship';
import {
	getCellsCoordsAroundShip,
	getInactiveCellCoordsForInstallWithShipRotation,
	parseCoords,
} from '@/utils/table';
import { Nullable } from '@/types/utils';
import { getShipCoords } from '@/utils/ship';
import { RootStore } from './root';

export class GameFieldStore {
	private store: RootStore;

	ships: Record<string, { rotation: ShipRotation; size: ShipSize }> = {};

	activeInstalledShip: Nullable<string> = null;

	coordsWithShips = new Set<string>();

	coordsWithBombs = new Set<string>();

	private inactiveCoordsForInstall = new Set<string>();

	constructor(store: RootStore) {
		makeAutoObservable(this);

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

	installShip({
		shipCoords,
		shipRotation,
		shipSize,
	}: {
		shipCoords: string[];
		shipRotation: ShipRotation;
		shipSize: ShipSize;
	}) {
		const [initialCoords] = shipCoords;

		this.ships[initialCoords] = {
			rotation: shipRotation,
			size: shipSize,
		};

		shipCoords.forEach((coord) => this.coordsWithShips.add(coord));

		const inactiveCoords = getCellsCoordsAroundShip({ shipCoords, shipRotation, shipSize });
		inactiveCoords.forEach((coord) => this.inactiveCoordsForInstall.add(coord));

		this.store.shipsStore.decreaseShipAmount(shipSize);
		this.store.shipsStore.setActiveSize(null);
	}

	removeActiveInstalledShip = () => {
		const shipInitialCoords = this.activeInstalledShip!;
		const { size: shipSize, rotation: shipRotation } = this.ships[shipInitialCoords];
		const [[xFirstCellPosition, yFirstCellPosition]] = parseCoords(shipInitialCoords);
		const shipCoordsForDelete = getShipCoords({
			xFirstCellPosition,
			yFirstCellPosition,
			shipSize,
			shipRotation,
		});
		const cellsCoordsAroundShipForDelete = getCellsCoordsAroundShip({
			shipCoords: shipCoordsForDelete,
			shipRotation,
			shipSize,
		});

		shipCoordsForDelete.forEach((coord) => this.coordsWithShips.delete(coord));
		cellsCoordsAroundShipForDelete.forEach((coord) =>
			this.inactiveCoordsForInstall.delete(coord),
		);

		delete this.ships[this.activeInstalledShip!];
		this.activeInstalledShip = null;
		this.store.shipsStore.increaseShipAmount(shipSize);
	};
}
