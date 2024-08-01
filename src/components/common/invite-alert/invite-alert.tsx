import { observer } from 'mobx-react-lite';
import { Flex, Alert, Button, Typography } from 'antd';

import { useStoreContext } from '@/context/store-context';
import { useSocketGameEvents } from '@/hooks/use-socket-game-events';

import styles from './styles.module.css';

const { Text } = Typography;

export const InviteAlert = observer(() => {
	const { gameStore, shipsStore } = useStoreContext();
	const { acceptInvitation, rejectInvitation } = useSocketGameEvents();

	const { invitedByPlayerId } = gameStore;
	const { isAllShipsInstalled } = shipsStore;

	if (!invitedByPlayerId) {
		return null;
	}

	const handleAcceptClick = () => {
		acceptInvitation();
	};

	const handleCancelClick = () => {
		rejectInvitation();
	};

	const message = (
		<Flex gap="small" align="center">
			<Text className={styles.text}>
				Игрок{' '}
				<Text className={styles.fontSize} strong>
					{invitedByPlayerId}
				</Text>{' '}
				приглашает вас в игру
			</Text>
			<Button
				size="small"
				onClick={handleAcceptClick}
				disabled={!isAllShipsInstalled}
				className={styles.fontSize}
				type="primary"
			>
				Принять
			</Button>
			<Button size="small" onClick={handleCancelClick} className={styles.fontSize}>
				Отклонить
			</Button>
		</Flex>
	);

	return <Alert className={styles.alert} message={message} type="info" />;
});
