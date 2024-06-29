import { observer } from 'mobx-react-lite';
import { Button, Flex, Tag, Modal, Typography } from 'antd';

import { InviteMessage } from '@/components/common/invite-modal';
import { useStoreContext } from '@/context/store-context';

import { useSocketGameEvents } from '@/hooks/use-socket-game-events';
import styles from './styles.module.css';

const { Text } = Typography;

export const PlayersInfo = observer(() => {
	const { gameStore } = useStoreContext();
	const { leaveGame } = useSocketGameEvents();

	const handleLeaveButtonClick = () => {
		Modal.confirm({
			title: 'Вы точно хотите покинуть игру?',
			content: 'Вернуться в игру будет невозможно',
			okText: 'Покинуть игру',
			cancelText: 'Отмена',
			centered: true,
			maskClosable: true,
			onOk: leaveGame,
		});
	};

	return (
		<Flex gap="middle" className={styles.root}>
			<Flex vertical flex="0 1 50%">
				{!gameStore.isStarted && (
					<Flex vertical gap="small" className={styles.playerInfo}>
						<Text copyable>{gameStore.playerId}</Text>
						<InviteMessage />
					</Flex>
				)}
				{gameStore.isStarted && (
					<Flex flex="0 1 auto">
						<Button onClick={handleLeaveButtonClick} type="primary" danger>
							Покинуть игру
						</Button>
					</Flex>
				)}
			</Flex>
			{gameStore.isStarted && !gameStore.isEnemyOnline && (
				<Flex vertical flex="0 1 50%">
					<Tag color="red">не в сети</Tag>
				</Flex>
			)}
		</Flex>
	);
});
