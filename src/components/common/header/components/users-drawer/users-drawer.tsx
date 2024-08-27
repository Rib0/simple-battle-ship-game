import { useState } from 'preact/hooks';
import { JSX } from 'preact/jsx-runtime';
import { observer } from 'mobx-react-lite';
import { Drawer, DrawerProps, Input, Space } from 'antd';
import { SearchOutlined } from '@ant-design/icons';

import { useStoreContext } from '@/context/store-context';
import { UsersList } from './components/users-list';

import styles from '../../styles.module.css';

type Props = Pick<DrawerProps, 'open' | 'onClose'>; // TODO: мб вынести в общие типы с дровером настроек

export const UsersDrawer = observer<Props>((props) => {
	const [searchUsername, setSearchUsername] = useState('');

	const { usersStore } = useStoreContext();

	const handleChangeSearchUsername = (e: JSX.TargetedEvent<HTMLInputElement, Event>) => {
		if (!(e?.target instanceof HTMLInputElement)) {
			return;
		}

		const { value: targetValue } = e.target;

		setSearchUsername(targetValue);
	};

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
			<Input
				value={searchUsername}
				onChange={handleChangeSearchUsername}
				addonBefore={<SearchOutlined />}
				placeholder="Поиск игрока"
			/>
			<UsersList searchUsername={searchUsername} />
		</Drawer>
	);
});
