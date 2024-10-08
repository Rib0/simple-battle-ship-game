import { Server, Socket } from 'socket.io';
import { Socket as ClientSocketDefault } from 'socket.io-client';

import { Field, GameFieldShips } from './game-field';
import { Nullable } from './utils';

export enum SocketEvents {
	ERROR = 'ERROR',
	WARNING = 'WARNING',
	SET_AUTH_DATA = 'SET_AUTH_DATA',
	GET_USERS_ONLINE = 'GET_USERS_ONLINE',
	USER_JOINED = 'USER_JOINED',
	USER_EXIT = 'USER_EXIT',
	TIMER_TICK = 'TIMER_TICK',
	SEARCH_GAME = 'SEARCH_GAME',
	CANCEL_SEARCH_GAME = 'CANCEL_SEARCH_GAME',
	INVITE_BY_ID = 'INVITE_BY_ID',
	ACCEPT_INVITATION = 'ACCEPT_INVITATION',
	REJECT_INVITATION = 'REJECT_INVITATION',
	UPDATE_AWAITING_INVITATION_RESPONSE_STATUS = 'UPDATE_AWAITING_INVITATION_RESPONSE_STATUS',
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
	UPDATE_KILLED_SHIPS_INITIAL_COORDS = 'UPDATE_KILLED_SHIPS_INITIAL_COORDS',
	UPDATE_ENEMY_KILLED_SHIPS = 'UPDATE_ENEMY_KILLED_SHIPS',
	PLAYER_WON = 'PLAYER_WON',
}

export type ClientToServerEvents = {
	[SocketEvents.SET_AUTH_DATA]: VoidFunction;
	[SocketEvents.GET_USERS_ONLINE]: VoidFunction;
	[SocketEvents.SEARCH_GAME]: VoidFunction;
	[SocketEvents.CANCEL_SEARCH_GAME]: VoidFunction;
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
	killedShipsInitialCoords?: string[];
	enemyKilledShips?: GameFieldShips;
};

export type UserOnline = {
	playerId: string;
	isInGame: boolean;
};

export type UsersOnline = {
	users: Map<string /* playerId */, UserOnline>;
	inGameAmount: number;
};

export type UserOnlineFromServer = {
	users: { [key: string]: UserOnline };
	inGameAmount: UsersOnline['inGameAmount'];
};

export type ServerToClientEvents = {
	[SocketEvents.ERROR]: (message: string) => void;
	[SocketEvents.WARNING]: (message: string) => void;
	[SocketEvents.SET_AUTH_DATA]: (playerId: string) => void;
	[SocketEvents.GET_USERS_ONLINE]: (data: UserOnlineFromServer) => void;
	[SocketEvents.USER_JOINED]: (playerId: string, isInGame?: boolean) => void;
	[SocketEvents.USER_EXIT]: (playerId: string) => void;
	[SocketEvents.TIMER_TICK]: VoidFunction;
	[SocketEvents.INVITE_BY_ID]: (playerId: string) => void;
	[SocketEvents.REJECT_INVITATION]: (playerId: string) => void;
	[SocketEvents.UPDATE_AWAITING_INVITATION_RESPONSE_STATUS]: (isAwaiting: boolean) => void;
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
	[SocketEvents.UPDATE_KILLED_SHIPS_INITIAL_COORDS]: (killedShipsInitialCoords: string) => void;
	[SocketEvents.UPDATE_ENEMY_KILLED_SHIPS]: (enemyKilledShips: GameFieldShips) => void;
	[SocketEvents.PLAYER_WON]: (isMe: boolean) => void;
};

export type SocketData = Partial<{
	roomId: Nullable<string>; // нужно для события disconnect, чтобы отправить событие в комнату
	invitedPlayerIds: Set<string>; // id приглашенных пользователей
	playerInviterIds: Set<string>; // id пригласивших пользователей
}>;

export type ServerIo = Server<ClientToServerEvents, ServerToClientEvents, object, SocketData>;
export type ServerSocket = Socket<ClientToServerEvents, ServerToClientEvents, object, SocketData>;
export type ClientSocket = ClientSocketDefault<ServerToClientEvents, ClientToServerEvents>;
