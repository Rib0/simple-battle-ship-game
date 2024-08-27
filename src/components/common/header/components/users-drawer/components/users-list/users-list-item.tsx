import { observer } from 'mobx-react-lite';
import { Avatar, Button, List } from 'antd';
import { PlayCircleOutlined, UserOutlined } from '@ant-design/icons';

import { useSocketGameEvents } from '@/hooks/use-socket-game-events';
import { useStoreContext } from '@/context/store-context';

import styles from './styles.module.css';

type Props = {
	id: string;
	isInGame: boolean;
};

export const UsersListItem = observer<Props>(({ id, isInGame }) => {
	const { shipsStore, gameStore } = useStoreContext();
	const { inviteById } = useSocketGameEvents();

	const { isAllShipsInstalled } = shipsStore;
	const { playerId, isStarted } = gameStore;

	const handleInviteClick = () => {
		inviteById(id);
	};

	const isMe = id === playerId;
	const isInviteButtonDisabled = isMe || !isAllShipsInstalled || isInGame || isStarted;

	return (
		<List.Item
			actions={[
				!isMe && (
					<Button
						disabled={isInviteButtonDisabled}
						onClick={handleInviteClick}
						type="primary"
						icon={<PlayCircleOutlined />}
					/>
				),
			]}
		>
			<List.Item.Meta
				avatar={
					<Avatar className={isInGame ? styles.isInGame : ''} icon={<UserOutlined />} />
				}
				title={id}
			/>
		</List.Item>
	);
});
