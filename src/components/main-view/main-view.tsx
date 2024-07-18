import { useEffect } from 'preact/hooks';
import { observer } from 'mobx-react-lite';

import { useSocketGameEvents } from '@/hooks/use-socket-game-events';
import { Notifications } from '@/components/common/notifications';
import { GameField } from '@/components/game-field';

import styles from './styles.module.css';

export const MainView = observer(() => {
	const { socket, initiateSocketConnection, setAuthData, findGameToReconnect } =
		useSocketGameEvents();

	useEffect(() => {
		initiateSocketConnection();
	}, [initiateSocketConnection]);

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
