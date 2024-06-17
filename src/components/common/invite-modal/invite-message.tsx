import { observer } from 'mobx-react-lite';
import { Space, Alert, Button } from 'antd';

import { useStoreContext } from '@/context/store-context';
import { useSocketGameEvents } from '@/hooks/use-socket-game-events';

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

	// TODO: сделать жирным id игрока

	const message = (
		<Space>
			Игрок <strong>{invitedByPlayer}</strong> приглашает вас в игру
			<Button onClick={handleAcceptClick} type="primary">
				Принять
			</Button>
			<Button onClick={handleCancelClick}>Отклонить</Button>
		</Space>
	);

	return <Alert message={message} type="info" />;
});
