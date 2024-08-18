import { useStoreContext } from '@/context/store-context';
import { List } from 'antd';
import { observer } from 'mobx-react-lite';

import { UsersListItem } from './user-list-item';

export const UsersList = observer(() => {
	const { usersStore } = useStoreContext();

	const data = usersStore.getAllUsers;

	return (
		<List
			dataSource={data}
			itemLayout="horizontal"
			renderItem={(item) => <UsersListItem id={item.playerId} isInGame={item.isInGame} />}
		/>
	);
});
