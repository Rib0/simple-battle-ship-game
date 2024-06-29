import { PropsWithChildren } from 'preact/compat';
import { observer } from 'mobx-react-lite';
import cx from 'classnames';

import styles from './styles.module.css';

type Props = {
	onClick: VoidFunction;
	type: 'rotate_ship' | 'shuffle_ships' | 'start_battle' | 'cancel';
	className?: string;
};

export const Button = observer<PropsWithChildren<Props>>(
	({ children, onClick, type, className }) => (
		<button
			type="button"
			onClick={onClick}
			className={cx(styles.button, styles[`type_${type}`], className)}
		>
			{children}
		</button>
	),
);
