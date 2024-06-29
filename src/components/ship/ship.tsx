import { CSSProperties } from 'preact/compat';
import { useMemo } from 'preact/hooks';
import { observer } from 'mobx-react-lite';
import { Flex } from 'antd';
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
	invisible?: boolean;
	style?: CSSProperties;
	className?: string;
};

/* eslint-disable jsx-a11y/control-has-associated-label */

export const Ship = observer<Props>(
	({ size, rotation, amount, onClick, invisible, style = {}, className }) => {
		const shipSizeArray = useMemo(() => arrayFromDigit(size), [size]);

		const handleClick = () => {
			onClick?.(size);
		};

		const rootClassName = cx(invisible && styles.invisible, className);
		const rootStyle = {
			...style,
			transform: `${style.transform || ''} ${rotation ? getShipRotationStyles(rotation) : ''}`,
		};

		return (
			<Flex align="center" className={rootClassName} style={rootStyle}>
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
				{amount !== undefined && (
					<Flex align="center" className={styles.amount}>
						{amount}
					</Flex>
				)}
			</Flex>
		);
	},
);
