import { useEffect } from 'preact/hooks';
import { observer } from 'mobx-react-lite';
import { Space } from 'antd';

import { useStoreContext } from '@/context/store-context';
import { useSocketGameEvents } from '@/hooks/use-socket-game-events';
import { GameField } from '@/components/game-field';
import { TableEnemy } from '@/components/tables';
import { SetupForGame } from '@/components/setup-for-game';
import { InviteMessage } from '@/components/common/invite-modal';

import { getPlayerIdByCookie } from '@/utils/cookie';

import styles from './styles.module.css';

export const MainView = observer(() => {
	const { gameStore } = useStoreContext();
	const { socket, initiateSocketConnection, findGameToReconnect } = useSocketGameEvents();

	useEffect(() => {
		initiateSocketConnection();
	}, [initiateSocketConnection]);

	useEffect(() => {
		if (socket) {
			findGameToReconnect();
		}
	}, [socket, findGameToReconnect]);

	const playerId = getPlayerIdByCookie();

	return (
		<div className={styles.root}>
			{!gameStore.isStarted && (
				<Space className={styles.header}>
					<div>{playerId}</div>
					<InviteMessage />
				</Space>
			)}
			<div className={styles.mainGameField}>
				<GameField />
				{!gameStore.isStarted && <SetupForGame />}
			</div>
			{gameStore.isStarted && <TableEnemy />}
		</div>
	);
});
