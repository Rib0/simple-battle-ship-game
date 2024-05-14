import { Socket } from 'socket.io';
import cookie from 'cookie';

import { COOKIES } from '@/constants/cookie';

export const getPlayerId = (player: Socket) =>
	cookie.parse(player.handshake.headers.cookie || '')[COOKIES.playerId];
