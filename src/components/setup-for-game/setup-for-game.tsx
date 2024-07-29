import { observer } from 'mobx-react-lite';
import { Flex } from 'antd';

import { ShipsForInstall } from '@/components/ships-for-install';
import { StartGameActions } from '@/components/start-game-actions';

import styles from './styles.module.css';

export const SetupForGame = observer(() => (
	<Flex vertical className={styles.root}>
		<ShipsForInstall />
		<StartGameActions />
	</Flex>
));
