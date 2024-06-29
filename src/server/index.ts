import { Server } from 'socket.io';

import { ServerIo } from '@/types/socket';
import { registerHandlers } from './handlers/register-handlers';
import { Timer } from './lib/timer';

const io: ServerIo = new Server({
	cors: {
		origin: 'http://localhost:8080', // TODO: сделать только для дева исользовать donteenv для разных сред, перенести хост в переменные
	},
});

// Реализовать логику полного выхода из игры и реакции на это противника, почему не ищет игру сразу после покидания
// TODO: реализовать отображение очереди и таймера и проверить как это работает при отключении и тд
// При убийстве корабля, показывать какой был корабль с opacity, и красными крестиками на нем и взрывать все ячейки вокруг него постепенно со звуком
// Посмотреть как работает очередь хода и перезагрузка состояния при отключении и переподключении в игру
// TODO: сделать динамический список сокетов которые онлайн
// TODO: сделать версию для телефона

Timer.start(io);

io.on('connection', (socket) => {
	registerHandlers(io, socket);
});

io.listen(3000);
