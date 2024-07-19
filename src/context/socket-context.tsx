import { createContext } from 'preact';
import { io } from 'socket.io-client';
import { PropsWithChildren, useCallback, useContext, useState } from 'preact/compat';
import { observer } from 'mobx-react-lite';

import { LocaleStorage } from '@/utils/locale-storage';
import { SERVER_HOST } from '@/constants/socket';
import { ClientSocket } from '@/types/socket';

type SocketContextValue = {
	connectSocket: VoidFunction;
	socket?: ClientSocket;
};

const SocketContext = createContext<SocketContextValue>({
	connectSocket: () => {},
});
const useSocketContext = () => useContext(SocketContext);

const SocketProvider = observer<PropsWithChildren>(({ children }) => {
	const [socket, setSocket] = useState<ClientSocket>();

	const handleConnectSocket = useCallback(() => {
		const playerId = LocaleStorage.get('player_id_battle_ship_game');

		const socketConnection = io(SERVER_HOST, {
			auth: {
				playerId,
			},
		});

		setSocket(socketConnection);

		return socketConnection;
	}, []);

	const value = {
		connectSocket: handleConnectSocket,
		socket,
	};

	return <SocketContext.Provider value={value}>{children}</SocketContext.Provider>;
});

export { useSocketContext, SocketProvider };
