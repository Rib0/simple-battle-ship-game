import { Socket } from 'socket.io';

import { Field } from '@/types/game-field';
import { DeepPartial } from '@/types/utils';

export const SEARCHING_GAME_PLAYERS: Socket[] = [];

type Rooms = DeepPartial<{
	[roomId: string]: {
		[playerId: string]: {
			socketId: Socket['id'];
			field: Field;
		};
	};
}>;

export const ROOMS: Rooms = {};
