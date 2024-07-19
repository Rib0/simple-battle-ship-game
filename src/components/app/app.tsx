import { useEffect } from 'preact/hooks';
import { observer } from 'mobx-react-lite';

import { GameField } from '@/components/game-field';
import { Notifications } from '@/components/common/notifications';
import { useSocketGameEvents } from '@/hooks/use-socket-game-events';
import { useSocketHandleServerEvents } from '@/hooks/use-socket-handle-server-events';
import { useSocketContext } from '@/context/socket-context';

import styles from './styles.module.css';

export const App = observer(() => {
	const { socket, connectSocket } = useSocketContext();
	const { setAuthData, findGameToReconnect } = useSocketGameEvents();

	useSocketHandleServerEvents(socket);

	useEffect(() => {
		connectSocket();
	}, [connectSocket]);

	useEffect(() => {
		if (socket) {
			setAuthData();
			findGameToReconnect();
		}
	}, [socket, setAuthData, findGameToReconnect]);

	return (
		<div className={styles.root}>
			<Notifications />
			<GameField />
		</div>
	);
});
