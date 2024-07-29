import { useEffect } from 'preact/hooks';
import { observer } from 'mobx-react-lite';
import cx from 'classnames';

import { GameField } from '@/components/game-field';
import { Notifications } from '@/components/common/notifications';
import { useSocketGameEvents } from '@/hooks/use-socket-game-events';
import { useOrientation } from '@/hooks/use-orientation';
import { useSocketHandleServerEvents } from '@/hooks/use-socket-handle-server-events';
import { useSocketContext } from '@/context/socket-context';
import { useStoreContext } from '@/context/store-context';

import styles from './styles.module.css';

export const App = observer(() => {
	const { socket, connectSocket } = useSocketContext();
	const { setAuthData, findGameToReconnect } = useSocketGameEvents();
	const { gameStore } = useStoreContext();

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
		<div className={cx(styles.root, gameStore.isStarted && styles.started)}>
			<Notifications />
			<GameField />
		</div>
	);
});
