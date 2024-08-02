export class Room {
	private turnStartTime: number;

	private turnPlayerId: string;

	private turnId: string;

	private players: {
		[playerId: string]: PlayerData;
	};
}
