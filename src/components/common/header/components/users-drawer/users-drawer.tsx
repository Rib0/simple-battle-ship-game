import { observer } from 'mobx-react-lite';
import { Drawer, DrawerProps } from 'antd';

type Props = Pick<DrawerProps, 'open' | 'onClose'>; // TODO: мб вынести в общие типы с дровером настроек

export const UsersDrawer = observer<Props>((props) => {
	const handleChange = () => {};

	// TODO: писать в title количество игроков онлайн
	return (
		<Drawer title="Игроков онлайн" placement="left" {...props}>
			<div>234</div>
		</Drawer>
	);
});
