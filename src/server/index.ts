import { Server } from 'socket.io';

import { ServerIo } from '@/types/socket';
import { registerHandlers } from './handlers/register-handlers';
import { Timer } from './lib/timer';

const io: ServerIo = new Server({
	cors: {
		origin: 'http://localhost:8080', // TODO: сделать только для дева исользовать donteenv для разных сред, перенести хост в переменные
	},
});

/* 
		1. сделать динамический список сокетов которые онлайн, добавлять в список при socket.connect, изменять isPlaying флаг при leave room, reconnected to room, joined game, убирать при socket.disconnect писать сколько в игре и сколько всего игроков, запрашивать список только при открытии drawer
		2. Добавить фон, вибрацию, звук эффектов, музыку и настройки для их отключения и уменьшения громкости
		3. Добавить разные звуки для действий, также для кликов и наведения на кнопки должен быть один и тот же звук
		4. Добавить интернациолизацию https://react.i18next.com/getting-started
+       5. Сделать анимацию летящей ракеты, ракета будет лететь из разных кораблей по прямой, наклон ракеты регулировать в зависимости от diff координат куда лететь
+       6. Оформить красивое описание на github
+*/

Timer.start(io);

io.on('connection', (socket) => {
	registerHandlers(io, socket);
});

io.listen(3001);
