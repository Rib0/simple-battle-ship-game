import { createContext } from 'preact';
import { PropsWithChildren, useCallback, useContext, useState } from 'preact/compat';
import { observer } from 'mobx-react-lite';

import { useSocketHandleServerEvents } from '@/hooks/use-socket-handle-server-events';
import { ClientSocket } from '@/types/socket';

type SocketContextValue = {
	connectSocket: (socket: ClientSocket) => void;
	socket?: ClientSocket;
};

const SocketContext = createContext<SocketContextValue>({
	connectSocket: () => {},
});
const useSocketContext = () => useContext(SocketContext);

const SocketProvider = observer<PropsWithChildren>(({ children }) => {
	const [socket, setSocket] = useState<ClientSocket>();

	useSocketHandleServerEvents(socket);

	const handleConnectSocket = useCallback((socketConnection: ClientSocket) => {
		setSocket(socketConnection);
	}, []);

	const value = {
		connectSocket: handleConnectSocket,
		socket,
	};

	return <SocketContext.Provider value={value}>{children}</SocketContext.Provider>;
});

export { useSocketContext, SocketProvider };
