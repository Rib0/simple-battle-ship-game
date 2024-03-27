import { FunctionComponent } from 'preact';
import { memo } from 'preact/compat';
import cx from 'classnames';

import { ShipsInstalled } from '@/components/ships-installed';

import { arrayFromDigit } from '@/utils/array-from-digit';
import { getTableCoordsHoveredByShip } from '@/utils/ship';
import { FIELD_SIDE_SIZE } from '@/constants';
import styles from './styles.module.css';

const fieldSideArray = arrayFromDigit(FIELD_SIDE_SIZE);

/* eslint-disable react/no-array-index-key */
/* eslint-disable jsx-a11y/control-has-associated-label */

type Props = {
	hoveredCoords: ReturnType<typeof getTableCoordsHoveredByShip>;
};

export const Table: FunctionComponent<Props> = memo(({ hoveredCoords }) => (
	<table className={styles.table}>
		<tbody>
			{fieldSideArray.map((_, rI) => (
				<tr key={rI} className={styles.tr}>
					{fieldSideArray.map((__, cI) => (
						<td
							key={cI}
							className={cx(styles.td, {
								[styles.hovered]: hoveredCoords?.includes(`${cI}-${rI}`),
							})}
						/>
					))}
				</tr>
			))}
		</tbody>
		<ShipsInstalled />
	</table>
));
