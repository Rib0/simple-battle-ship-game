import { observer } from 'mobx-react-lite';
import { Button, Flex, Modal, Typography } from 'antd';

import { DndDroppable } from '@/components/common/drag-and-drop/dnd-droppable';
import { InviteAlert } from '@/components/common/invite-alert';
import { TimeProgress } from '@/components/common/time-progress';
import { useStoreContext } from '@/context/store-context';

import { useSocketGameEvents } from '@/hooks/use-socket-game-events';
import { Nullable } from '@/types/utils';
import { Table } from '../table/table';

import styles from '../styles.module.css';

const { Text } = Typography;

type Props = {
	hoveredCoords: Nullable<string[]>;
};

export const TableWithActions = observer<Props>(({ hoveredCoords }) => {
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
		<Flex className={styles.root} vertical gap="small">
			<div>
				<Button
					onClick={handleLeaveButtonClick}
					type="primary"
					danger
					className={gameStore.isStarted ? '' : styles.hidden}
				>
					Покинуть игру
				</Button>
			</div>
			<Flex className={gameStore.isStarted ? styles.hidden : ''} vertical gap="small">
				<InviteAlert />
				<Text className={styles.text} copyable>
					{gameStore.playerId}
				</Text>
			</Flex>
			<DndDroppable>
				<Table hoveredCoords={hoveredCoords} />
			</DndDroppable>
			<div className={gameStore.isMyTurn ? '' : styles.hidden}>
				<TimeProgress />
			</div>
		</Flex>
	);
});
