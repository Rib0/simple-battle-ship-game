import { useEffect } from 'preact/hooks';
import { observer } from 'mobx-react-lite';
import { Space } from 'antd';

import { useStoreContext } from '@/context/store-context';
import { useSocketGameEvents } from '@/hooks/use-socket-game-events';
import { GameField } from '@/components/game-field';
import { TableEnemy } from '@/components/tables';
import { SetupForGame } from '@/components/setup-for-game';
import { InviteMessage } from '@/components/common/invite-modal';

import styles from './styles.module.css';

export const MainView = observer(() => {
	const { gameStore } = useStoreContext();
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
		<Space direction="vertical" className={styles.root}>
			{!gameStore.isStarted && (
				<Space direction="vertical" className={styles.header}>
					<div>{gameStore.playerId}</div>
					<InviteMessage />
				</Space>
			)}
			<Space>
				<GameField />
				{!gameStore.isStarted && <SetupForGame />}
				{gameStore.isStarted && <TableEnemy />}
			</Space>
		</Space>
	);
});
