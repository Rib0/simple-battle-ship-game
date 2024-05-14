import { createContext } from 'preact';
import { PropsWithChildren, useContext, useState } from 'preact/compat';
import { observer } from 'mobx-react-lite';
import { Socket } from 'socket.io-client';
import { useSocketHandleServerEvents } from '@/hooks/use-socket-handle-server-events';

type SocketContextValue = {
	connectSocket: (socket: Socket) => void;
	socket?: Socket;
};

const SocketContext = createContext<SocketContextValue>({
	connectSocket: () => {},
});
const useSocketContext = () => useContext(SocketContext);

const SocketProvider = observer<PropsWithChildren>(({ children }) => {
	const [socket, setSocket] = useState<Socket>();

	useSocketHandleServerEvents(socket);

	const handleConnectSocket = (socketConnection: Socket) => {
		setSocket(socketConnection);
	};

	const value = {
		connectSocket: handleConnectSocket,
		socket,
	};

	return <SocketContext.Provider value={value}>{children}</SocketContext.Provider>;
});

export { useSocketContext, SocketProvider };
