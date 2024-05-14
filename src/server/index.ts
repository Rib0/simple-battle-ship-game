import { Server } from 'socket.io';
import { createServer } from 'http';

import { registerHandlers } from './handlers/register-handlers';

// middlewares выполняются при каждом соеденении on.connection
// можно добавлять аттрибуты в socket, socket.info = info

const httpServer = createServer();

const io = new Server(httpServer, {
	cors: {
		origin: 'http://localhost:8080', // TODO: сделать только для дева исользовать donteenv для разных сред
		credentials: true, // отправляет с сервера заголовок 'Access-Control-Allow-Credentials: true' (разрешаеи отправлять заголовок cookie в header) для preflight запроса с другого домена, в случае, если клиент отправляет непустой Header Cookie
	},
	connectionStateRecovery: {},
});

// Контроллер за ходом участника сделать на сервере и при смене хода на клиенте запускать таймер, перенести весь state и логику на сервер
// TODO: тут проверять при подключении по куки есть ли уже такой в комнате, если есть, подключать в игру и отправлять ему текущее состояние игры
// TODO: при закрытии браузера использовать onBeforeOnload для отправки событий, а не useEffect
// TODO: сделать функционал по приглашению в игру

io.on('connection', (socket) => {
	registerHandlers(io, socket);
});

io.listen(3000);
