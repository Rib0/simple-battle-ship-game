import { observer } from 'mobx-react-lite';
import { Flex } from 'antd';

import { ShipsForInstall } from '@/components/ships-for-install';
import { StartGameActions } from '@/components/start-game-actions';

export const SetupForGame = observer(() => (
	<Flex vertical justify="space-between">
		<ShipsForInstall />
		<StartGameActions />
	</Flex>
));
