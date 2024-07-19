import { observer } from 'mobx-react-lite';
import cx from 'classnames';

import styles from './styles.module.css';

type Props = {
	value?: number;
};

export const Digit = observer<Props>(({ value }) => (
	<div className={cx(styles.digit, styles[`_${value}`])} />
));
