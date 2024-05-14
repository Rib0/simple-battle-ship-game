import { CSSProperties } from 'preact/compat';
import { useMemo } from 'preact/hooks';
import { observer } from 'mobx-react-lite';
import cx from 'classnames';

import { ShipRotation, ShipSize } from '@/types/ship';

import { arrayFromDigit } from '@/utils/array-from-digit';
import { getShipRotationStyles } from '@/utils/ship';

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

export const Ship = observer<Props>(
	({ size, rotation, amount, onClick, style = {}, className }) => {
		const shipSizeArray = useMemo(() => arrayFromDigit(size), [size]);

		const handleClick = () => {
			onClick?.(size);
		};

		const rootClassName = cx(styles.shipContainer, className);
		const rootStyle = {
			...style,
			transform: `${style.transform || ''} ${rotation ? getShipRotationStyles(rotation) : ''}`,
		};

		return (
			<div className={rootClassName} style={rootStyle}>
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
	},
);
