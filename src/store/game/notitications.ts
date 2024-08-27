import { makeAutoObservable } from 'mobx';
import { NotificationArgsProps } from 'antd';
import { nanoid } from 'nanoid';

export class Notifications {
	private list: Array<{
		id: string;
		message: string;
		onClose?: VoidFunction;
		type?: NotificationArgsProps['type'];
	}> = [];

	constructor() {
		makeAutoObservable(this);
	}

	addNotification = (
		{ message, type = 'info' }: { message: string; type: NotificationArgsProps['type'] },
		onClose?: VoidFunction,
	) => {
		const id = nanoid();

		this.list.push({ id, message, onClose, type });
	};

	get lastNotitication() {
		const notificationsLength = this.list.length;
		if (!notificationsLength) {
			return null;
		}

		return this.list[notificationsLength - 1];
	}

	removeNotitification = (id: string) => {
		const index = this.list.findIndex((notification) => notification.id === id);

		this.list.splice(index, 1);
	};
}
