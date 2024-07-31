import { useEffect } from 'preact/hooks';
import { observer } from 'mobx-react-lite';

import { GameField } from '@/components/game-field';
import { Layout } from '@/components/common/layout';
import { Notifications } from '@/components/common/notifications';
import { useSocketGameEvents } from '@/hooks/use-socket-game-events';
import { useOrientation } from '@/hooks/use-orientation';
import { useSocketHandleServerEvents } from '@/hooks/use-socket-handle-server-events';
import { useSocketContext } from '@/context/socket-context';

export const App = observer(() => {
	const { socket, connectSocket } = useSocketContext();
	const { setAuthData, findGameToReconnect } = useSocketGameEvents();

	useSocketHandleServerEvents(socket);
	const isNeedChangeOrientation = useOrientation();

	useEffect(() => {
		connectSocket();
	}, [connectSocket]);

	useEffect(() => {
		if (socket) {
			setAuthData();
			findGameToReconnect();
		}
	}, [socket, setAuthData, findGameToReconnect]);

	if (isNeedChangeOrientation) {
		return null;
	}

	return (
		<>
			<Notifications />
			<Layout>
				<GameField />
			</Layout>
		</>
	);
});
