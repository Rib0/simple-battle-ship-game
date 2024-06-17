import cookie from 'cookie';

import { COOKIES } from '@/constants/cookie';

const getAllCookies = () => cookie.parse(document.cookie);

export const getPlayerIdByCookie = () => getAllCookies()[COOKIES.playerId];
