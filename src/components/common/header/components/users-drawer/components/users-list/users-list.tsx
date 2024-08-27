import { observer } from 'mobx-react-lite';
import { List } from 'antd';

import { useStoreContext } from '@/context/store-context';
import { UsersListItem } from './users-list-item';

type Props = {
	searchUsername: string;
};

export const UsersList = observer<Props>(({ searchUsername }) => {
	const { usersStore } = useStoreContext();

	const usersListData = usersStore.getAllUsers(searchUsername);

	return (
		<List
			dataSource={usersListData}
			itemLayout="horizontal"
			renderItem={(item) => <UsersListItem id={item.playerId} isInGame={item.isInGame} />}
			pagination={{
				hideOnSinglePage: true,
				total: usersListData.length,
			}}
		/>
	);
});
