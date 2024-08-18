import { observer } from 'mobx-react-lite';
import { Drawer, DrawerProps, Space } from 'antd';

import { useStoreContext } from '@/context/store-context';
import { UsersList } from './components/users-list';

import styles from '../../styles.module.css';

type Props = Pick<DrawerProps, 'open' | 'onClose'>; // TODO: мб вынести в общие типы с дровером настроек

export const UsersDrawer = observer<Props>((props) => {
	const { usersStore } = useStoreContext();

	const title = (
		<Space className={styles.title} align="center">
			В игре:
			<span className={styles.playersCount}>
				{usersStore.inGameAmount} / {usersStore.list.size}
			</span>
		</Space>
	);

	return (
		<Drawer title={title} placement="left" {...props}>
			<UsersList />
		</Drawer>
	);
});
