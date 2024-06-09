import { nanoid } from 'nanoid';
import cookie from 'cookie';

import { COOKIES } from '@/constants/cookie';
import { ServerIo } from '@/types/socket';
import { getPlayerIdByCookie, getPlayerIdByHandshake } from '../lib/cookie';

export const initialHeadersHandler = (io: ServerIo) => {
	const hasListener = io.engine.listeners('initial_headers').length > 0;

	if (hasListener) {
		return;
	}

	io.engine.on('initial_headers', (headers: Record<string, string>, request: Request) => {
		const { cookie: socketCookie = '' } = request.headers as unknown as { cookie: string };
		const prevPlayerIdCookie = getPlayerIdByCookie(socketCookie);

		const sockets = Array.from(io.sockets.sockets.values());
		const socketWithEqualPlayerId = sockets.find(
			(playerSocket) => getPlayerIdByHandshake(playerSocket) === prevPlayerIdCookie,
		);

		if (prevPlayerIdCookie) {
			if (socketWithEqualPlayerId) {
				socketWithEqualPlayerId.disconnect();
			}

			return;
		}

		const playerId = nanoid();
		const playerIdCookie = cookie.serialize(COOKIES.playerId, playerId, {
			path: '/',
			maxAge: 60 * 60,
			expires: new Date(new Date().setHours(new Date().getHours() + 1)),
		});

		headers['Set-cookie'] = playerIdCookie;
	});
};
