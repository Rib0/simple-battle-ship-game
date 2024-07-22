import { CellType } from '@/types/game-field';
import { ServerState } from '../server-state';

export const checkIsGameOver = (roomId: string) => {
	const roomData = ServerState.getRoomData(roomId);

	if (!roomData?.players) {
		return false;
	}

	const [player1, player2] = Object.values(roomData?.players);

	const player1Field = player1?.field || {};
	const player2Field = player2?.field || {};

	const hasShipInPlayer1Field = Object.values(player1Field).some(
		(cell) => cell === CellType.SHIP,
	);
	const hasShipInPlayer2Field = Object.values(player2Field).some(
		(cell) => cell === CellType.SHIP,
	);

	return !hasShipInPlayer1Field || !hasShipInPlayer2Field;
};
