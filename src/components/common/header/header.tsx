import { observer } from 'mobx-react-lite';
import { SettingOutlined, UsergroupAddOutlined } from '@ant-design/icons';
import { Button, ButtonProps, Flex } from 'antd';

import { useBooleanState } from '@/hooks/use-boolean-state';
import { SettingsDrawer } from './components/settings-drawer';
import { UsersDrawer } from './components/users-drawer';

import styles from './styles.module.css';

const COMMON_BUTTON_PROPS: ButtonProps = {
	size: 'middle',
	type: 'primary',
	shape: 'circle',
};

export const Header = observer(() => {
	const [isUsersDrawerOpen, openUsersDrawer, closeUsersDrawer] = useBooleanState();

	return (
		<Flex gap="middle" className={styles.header}>
			<Button icon={<SettingOutlined />} {...COMMON_BUTTON_PROPS} />
			<Button
				onClick={openUsersDrawer}
				icon={<UsergroupAddOutlined />}
				{...COMMON_BUTTON_PROPS}
			/>
			<SettingsDrawer />
			<UsersDrawer open={isUsersDrawerOpen} onClose={closeUsersDrawer} />
		</Flex>
	);
});
