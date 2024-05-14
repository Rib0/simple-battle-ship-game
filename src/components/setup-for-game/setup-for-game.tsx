import { observer } from 'mobx-react-lite';

import { ShipsForInstall } from '@/components/ships-for-install';
import { StartGameActions } from '@/components/start-game-actions';

import styles from './styles.module.css';

export const SetupForGame = observer(() => (
	<div className={styles.root}>
		<ShipsForInstall />
		<StartGameActions />
	</div>
));
