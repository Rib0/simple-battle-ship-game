import { observer } from 'mobx-react-lite';
import { SettingOutlined, UsergroupAddOutlined } from '@ant-design/icons';
import { Button, Flex } from 'antd';

import { useBooleanState } from '@/hooks/use-boolean-state';
import { SettingsDrawer } from './components/settings-drawer';
import { UsersDrawer } from './components/users-drawer';

import styles from './styles.module.css';

export const Header = observer(() => {
	const [isUsersDrawerOpen, openUsersDrawer, closeUsersDrawer] = useBooleanState();

	return (
		<Flex gap="middle" className={styles.header}>
			<Button size="middle" type="primary" shape="circle" icon={<SettingOutlined />} />
			<Button
				onClick={openUsersDrawer}
				size="middle"
				type="primary"
				shape="circle"
				icon={<UsergroupAddOutlined />}
			/>
			<SettingsDrawer />
			<UsersDrawer open={isUsersDrawerOpen} onClose={closeUsersDrawer} />
		</Flex>
	);
});
