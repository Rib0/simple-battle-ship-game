import { Server } from 'socket.io';

import { ServerIo } from '@/types/socket';
import { registerHandlers } from './handlers/register-handlers';
import { Timer } from './lib/timer';

const io: ServerIo = new Server({
	cors: {
		origin: 'http://localhost:8080', // TODO: сделать только для дева исользовать donteenv для разных сред, перенести хост в переменные
	},
});

// TODO: проверить почему не работает с изначально пустым localStorage
// TODO: отображать подбитые ячейки (промах) и корабли на своем поле
// TODO: сделать красивые цифры возле количества кораблей, которые можно установить
// TODO: добавить подсказки куда нажать, чтобы установить корабль и тд

// При убийстве корабля, показывать какой был корабль с opacity, и красными крестиками на нем и взрывать все ячейки вокруг него постепенно со звуком, исключать уже взорванные ячейки, если такие есть
// TODO: сделать динамический список сокетов которые онлайн, добавлять в список при socket.connect, leave room. Убирать при reconnected to room, joined game
// Добавить фон, вибрацию, звук эффектов, музыку и настройки для их отключения и уменьшения громкости, Для телефона распологать таблицы вертикально
// TODO: сделать версию для телефона
// Добавить интернациолизацию
// Оформить красивое описание на github

Timer.start(io);

io.on('connection', (socket) => {
	registerHandlers(io, socket);
});

io.listen(3000);
