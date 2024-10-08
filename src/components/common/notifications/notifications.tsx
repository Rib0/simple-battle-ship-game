import { observer } from 'mobx-react-lite';
import { notification } from 'antd';

import { useStoreContext } from '@/context/store-context';
import { useEffect } from 'preact/hooks';

export const Notifications = observer(() => {
	// eslint-disable-next-line
	const [api, contextHolder] = notification.useNotification({ placement: 'top' });
	const { gameStore } = useStoreContext();

	const { lastNotitication, removeNotitification } = gameStore.notitications;

	useEffect(() => {
		if (!lastNotitication) {
			return;
		}

		const { id, message, onClose, type } = lastNotitication;

		api.open({
			type,
			key: id,
			message,
			showProgress: true,
			onClose: () => {
				removeNotitification(id);
				onClose?.();
			},
		});
	}, [lastNotitication, api, removeNotitification]);

	return <div>{contextHolder}</div>;
});
