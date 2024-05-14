export enum SocketEvents {
	TIMER_TICK = 'TIMER_TICK',
	SEARCH_GAME = 'SEARCH_GAME',
	JOINED_ROOM = 'JOINED_ROOM',
	LEAVED_ROOM = 'LEAVED_ROOM',
	ATTACK = 'ATTACK',
	DAMAGED = 'DAMAGED',
	PLAYER_WON = 'PLAYER_WON',
}

export type AttackEventPlayload = {
	roomId: string;
	coords: string;
};
