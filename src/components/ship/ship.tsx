import { FunctionComponent } from 'preact';
import { CSSProperties } from 'preact/compat';
import { useMemo } from 'preact/hooks';
import cx from 'classnames';

import { ShipRotation, ShipSize } from '@/types/ship';

import { arrayFromDigit } from '@/utils/array-from-digit';

import styles from './styles.module.css';

type Props = {
	size: ShipSize;
	rotation?: ShipRotation;
	amount?: number;
	onClick?: (size: ShipSize) => void;
	style?: CSSProperties;
	className?: string;
};

/* eslint-disable jsx-a11y/control-has-associated-label */

export const Ship: FunctionComponent<Props> = ({
	size,
	rotation,
	amount,
	onClick,
	style,
	className,
}) => {
	const shipSizeArray = useMemo(() => arrayFromDigit(size), [size]);

	const handleClick = () => {
		onClick?.(size);
	};

	const rootClassName = cx(styles.shipContainer, styles[`rotation_${rotation}`], className);

	return (
		<div className={rootClassName} style={style}>
			<button
				type="button"
				onClick={handleClick}
				className={cx(styles.ship, styles[`size_${size}`])}
			>
				<table>
					<tbody>
						<tr className={styles.tr}>
							{shipSizeArray.map(() => (
								<td className={styles.td} />
							))}
						</tr>
					</tbody>
				</table>
			</button>
			{amount !== undefined && <div className={styles.amount}>{amount}</div>}
		</div>
	);
};
