import { Server } from 'socket.io';

import { ServerIo } from '@/types/socket';
import { registerHandlers } from './handlers/register-handlers';
import { Timer } from './lib/timer';

const io: ServerIo = new Server({
	cors: {
		origin: 'http://localhost:8080', // TODO: сделать только для дева исользовать donteenv для разных сред, перенести хост в переменные
		credentials: true, // отправляет с сервера заголовок 'Access-Control-Allow-Credentials: true' (разрешает отправлять заголовок cookie в header) для preflight запроса с другого домена, в случае, если клиент отправляет непустой Header Cookie
	},
});

// TODO: при закрытии браузера использовать onBeforeOnload для отправки событий, а не useEffect
// TODO: сделать функционал по приглашению в игру
// Сделать окно для согласия принятия игры или отказа
// При убийстве корабля, показывать какой был корабль с opacity, и красными крестиками на нем и взрывать все ячейки вокруг него постепенно со звуком
// Посмотреть как работает очередь и перезагрузка состояния при отключении и переподключении в игру

Timer.start(io);

io.on('connection', (socket) => {
	registerHandlers(io, socket);
});

io.listen(3000);
