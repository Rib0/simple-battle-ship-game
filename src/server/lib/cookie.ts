import { Socket } from 'socket.io';
import cookie from 'cookie';

import { COOKIES } from '@/constants/cookie';

export const getPlayerIdByHandshake = (player: Socket) =>
	cookie.parse(player.handshake.headers.cookie || '')[COOKIES.playerId];

const getAllCookies = (cookies: string) => cookie.parse(cookies);

export const getPlayerIdByCookie = (cookies: string) => getAllCookies(cookies)[COOKIES.playerId];
