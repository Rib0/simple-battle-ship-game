import { observer } from 'mobx-react-lite';
import { Flex, Alert, Button, Typography } from 'antd';

import { useStoreContext } from '@/context/store-context';
import { useSocketGameEvents } from '@/hooks/use-socket-game-events';

import styles from './styles.module.css';

const { Text } = Typography;

export const InviteAlert = observer(() => {
	const { gameStore, shipsStore } = useStoreContext();
	const { acceptInvitation, rejectInvitation } = useSocketGameEvents();

	const { invitedByPlayer } = gameStore;
	const { isAllShipsInstalled } = shipsStore;

	if (!invitedByPlayer) {
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
			<Text style={{ whiteSpace: 'nowrap' }}>
				Игрок <Text strong>{invitedByPlayer}</Text> приглашает вас в игру
			</Text>
			<Button disabled={!isAllShipsInstalled} onClick={handleAcceptClick} type="primary">
				Принять
			</Button>
			<Button onClick={handleCancelClick}>Отклонить</Button>
		</Flex>
	);

	return <Alert className={styles.alert} message={message} type="info" />;
});
