import { Server } from 'socket.io';
import { nanoid } from 'nanoid';
import cookie from 'cookie';

import { COOKIES } from '@/constants/cookie';

export const initialHeadersHandler = (io: Server) => {
	io.engine.on('initial_headers', (headers: Record<string, string>) => {
		const playerId = nanoid();
		const playerIdCookie = cookie.serialize(COOKIES.playerId, playerId, {
			path: '/',
			httpOnly: false,
			// maxAge: 200, // TODO 1 hour
			// expires: new Date(), // TODO 1 hour
		});

		headers['Set-cookie'] = playerIdCookie;
	});
};
