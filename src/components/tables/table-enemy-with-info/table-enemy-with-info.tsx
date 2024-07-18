import { observer } from 'mobx-react-lite';
import { Flex, Tag } from 'antd';

import { TimeProgress } from '@/components/time-progress';
import { useStoreContext } from '@/context/store-context';
import { TableEnemy } from '../table-enemy/table-enemy';

import styles from '../styles.module.css';

export const TableEnemyWithInfo = observer(() => {
	const { gameStore } = useStoreContext();

	const isDisconnectedTagVisible = gameStore.isStarted && !gameStore.isEnemyOnline;

	return (
		<Flex vertical gap="small">
			<Tag className={isDisconnectedTagVisible ? '' : styles.hidden} color="red">
				не в сети
			</Tag>
			<TableEnemy />
			<div className={gameStore.isMyTurn ? styles.hidden : ''}>
				<TimeProgress />
			</div>
		</Flex>
	);
});
