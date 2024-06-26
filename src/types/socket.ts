import { Server, Socket } from 'socket.io';
import { Socket as ClientSocketDefault } from 'socket.io-client';
import { Field, GameFieldShips } from './game-field';
import { DeepPartial, Nullable } from './utils';

export enum SocketEvents {
	SET_AUTH_DATA = 'SET_AUTH_DATA',
	TIMER_TICK = 'TIMER_TICK',
	SEARCH_GAME = 'SEARCH_GAME',
	INVITE_BY_ID = 'INVITE_BY_ID',
	ACCEPT_INVITATION = 'ACCEPT_INVITATION',
	REJECT_INVITATION = 'REJECT_INVITATION',
	NO_PLAYER_TO_INVITE = 'NO_PLAYER_TO_INVITE',
	JOINED_ROOM = 'JOINED_ROOM',
	FIND_GAME_TO_RECONNECT = 'FIND_GAME_TO_RECONNECT',
	RECONNECTED_TO_ROOM = 'RECONNECTED_TO_ROOM',
	ENEMY_RECONNECTED_TO_ROOM = 'ENEMY_RECONNECTED_TO_ROOM',
	ENEMY_DISCONNECTED = 'ENEMY_DISCONNECTED',
	PLAYER_LEAVE_GAME = 'PLAYER_LEAVE_GAME',
	CHANGE_TURN = 'CHANGE_TURN',
	ATTACK = 'ATTACK',
	DAMAGED = 'DAMAGED',
	MISSED = 'MISSED',
	PLAYER_WON = 'PLAYER_WON',
}

export type ClientToServerEvents = {
	[SocketEvents.SET_AUTH_DATA]: VoidFunction;
	[SocketEvents.SEARCH_GAME]: VoidFunction;
	[SocketEvents.INVITE_BY_ID]: (playerId: string) => void;
	[SocketEvents.ACCEPT_INVITATION]: (playerId: string) => void;
	[SocketEvents.REJECT_INVITATION]: (playerId: string) => void;
	[SocketEvents.FIND_GAME_TO_RECONNECT]: (roomId: string) => void;
	[SocketEvents.PLAYER_LEAVE_GAME]: VoidFunction;
	[SocketEvents.ATTACK]: (coords: string, roomId: string) => void;
};

export type GameState = {
	field: Field;
	ships: GameFieldShips;
};

export type ServerToClientEvents = {
	[SocketEvents.SET_AUTH_DATA]: (playerId: string) => void;
	[SocketEvents.TIMER_TICK]: (serverTime: number) => void;
	[SocketEvents.NO_PLAYER_TO_INVITE]: VoidFunction;
	[SocketEvents.INVITE_BY_ID]: (playerId: string) => void;
	[SocketEvents.REJECT_INVITATION]: VoidFunction;
	[SocketEvents.JOINED_ROOM]: (roomId: string, callback: (data: GameState) => void) => void;
	[SocketEvents.RECONNECTED_TO_ROOM]: (
		myData: GameState,
		enemyField: Field,
		isEnemyConnected: boolean,
	) => void;
	[SocketEvents.ENEMY_RECONNECTED_TO_ROOM]: VoidFunction;
	[SocketEvents.ENEMY_DISCONNECTED]: VoidFunction;
	[SocketEvents.PLAYER_LEAVE_GAME]: VoidFunction;
	[SocketEvents.CHANGE_TURN]: (isYourTurn: boolean, turnStartTime: number) => void;
	[SocketEvents.DAMAGED]: (coords: string, isMe: boolean) => void;
	[SocketEvents.MISSED]: (coords: string, isMe: boolean) => void;
};

export type SocketData = Partial<{
	roomId: Nullable<string>; // нужно для события disconnect, чтобы отправить событие в комнату
	invitedPlayerId: Nullable<string>; // приглашенный playerId
	playerInviterId: Nullable<string>; // id игрока, который пригласил в игру
}>;

export type ServerIo = Server<ClientToServerEvents, ServerToClientEvents, object, SocketData>;
export type ServerSocket = Socket<ClientToServerEvents, ServerToClientEvents, object, SocketData>;
export type ClientSocket = ClientSocketDefault<ServerToClientEvents, ClientToServerEvents>;

export type Rooms = DeepPartial<{
	[roomId: string]: {
		turnStartTime: number;
		turnPlayerId: string;
		turnId: string;
		players: {
			[playerId: string]: {
				disconnectedTime: number;
				enemyPlayerId: string;
				socketId: Socket['id'];
				field: Field;
				ships: GameFieldShips;
			};
		};
	};
}>;
