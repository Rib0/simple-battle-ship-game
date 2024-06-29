import { observer } from 'mobx-react-lite';
import { Flex, Alert, Button, Typography } from 'antd';

import { useStoreContext } from '@/context/store-context';
import { useSocketGameEvents } from '@/hooks/use-socket-game-events';

const { Text } = Typography;

export const InviteMessage = observer(() => {
	const { gameStore } = useStoreContext();
	const { acceptInvitation, rejectInvitation } = useSocketGameEvents();

	const { invitedByPlayer } = gameStore;

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
			<Button onClick={handleAcceptClick} type="primary">
				Принять
			</Button>
			<Button onClick={handleCancelClick}>Отклонить</Button>
		</Flex>
	);

	return <Alert message={message} type="info" />;
});
