import { PropsWithChildren } from 'preact/compat';
import cx from 'classnames';

import { observer } from 'mobx-react-lite';
import styles from './styles.module.css';

type Props = {
	onClick: VoidFunction;
	type: 'rotate_ship' | 'cancel';
};

export const Button = observer<PropsWithChildren<Props>>(({ children, onClick, type }) => (
	<button type="button" onClick={onClick} className={cx(styles.button, styles[`type_${type}`])}>
		{children}
	</button>
));
