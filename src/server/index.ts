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
+       1. сделать версию для телефона mobile-first
		2. При убийстве корабля, показывать какой был корабль с opacity, и красными крестиками на нем и взрывать все ячейки вокруг него постепенно со звуком, исключать уже взорванные ячейки, если такие есть, умножать x координату на 1 коэф, y на 2 коеф
+       3. Сделать анимацию летящей ракеты
+       4. Добавить разные звуки для действий
+       5. Добавить фон, вибрацию, звук эффектов, музыку и настройки для их отключения и уменьшения громкости, Для телефона распологать таблицы вертикально
+       6. сделать динамический список сокетов которые онлайн, добавлять в список при socket.connect, leave room. Убирать при reconnected to room, joined game, писать сколько в игре и сколько всего игроков
+       7. Добавить интернациолизацию
+       8. Оформить красивое описание на github
+*/

Timer.start(io);

io.on('connection', (socket) => {
	registerHandlers(io, socket);
});

io.listen(3001);
