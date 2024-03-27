import { FunctionComponent } from 'preact';
import { PropsWithChildren } from 'preact/compat';
import cx from 'classnames';

import styles from './styles.module.css';

type Props = {
	onClick: VoidFunction;
	type?: 'rotate_ship';
};

export const Button: FunctionComponent<PropsWithChildren<Props>> = ({
	children,
	onClick,
	type = 'rotate_ship',
}) => (
	<button type="button" onClick={onClick} className={cx(styles.button, styles[`type_${type}`])}>
		{children}
	</button>
);
