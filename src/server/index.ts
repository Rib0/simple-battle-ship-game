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
		1. При убийстве корабля, показывать какой был корабль с opacity, подгружать подбитые корибли при переподлкючении
+       2. Сделать анимацию летящей ракеты
+       3. Добавить разные звуки для действий
+       4. Добавить фон, вибрацию, звук эффектов, музыку и настройки для их отключения и уменьшения громкости
+       5. сделать динамический список сокетов которые онлайн, добавлять в список при socket.connect, leave room. Убирать при reconnected to room, joined game, писать сколько в игре и сколько всего игроков
+       6. Добавить интернациолизацию
+       7. Оформить красивое описание на github
+*/

Timer.start(io);

io.on('connection', (socket) => {
	registerHandlers(io, socket);
});

io.listen(3001);
