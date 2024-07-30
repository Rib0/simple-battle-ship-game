import { observer } from 'mobx-react-lite';
import cx from 'classnames';

import { useStoreContext } from '@/context/store-context';

import styles from './styles.module.css';

export const TurnArrow = observer(() => {
	const { gameStore } = useStoreContext();

	return <div className={cx(styles.root, gameStore.isMyTurn && styles.rotated)} />;
});
