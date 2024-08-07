import { observer } from 'mobx-react-lite';
import { Flex } from 'antd';
import cx from 'classnames';

import { ShipsInstalled } from '@/components/ships-installed';
import { formatCoords } from '@/utils/table';
import { useStoreContext } from '@/context/store-context';
import { Nullable } from '@/types/utils';
import { FIELD_SIDE_ARRAY } from '@/components/tables/constants';

import stylesCommon from '@/components/tables/styles.module.css';
import styles from './styles.module.css';

/* eslint-disable react/no-array-index-key */
/* eslint-disable jsx-a11y/control-has-associated-label */

type Props = {
	hoveredCoords: Nullable<string[]>;
};

export const Table = observer<Props>(({ hoveredCoords }) => {
	const { gameFieldStore, shipsStore } = useStoreContext();

	return (
		<Flex vertical>
			<table className={stylesCommon.table}>
				<tbody>
					{FIELD_SIDE_ARRAY.map((_, rI) => (
						<tr key={rI} className={stylesCommon.tr}>
							{FIELD_SIDE_ARRAY.map((__, cI) => {
								const formattedCoords = formatCoords({ x: cI, y: rI });

								const isHovered = hoveredCoords?.includes(formattedCoords);
								const cantInstall =
									gameFieldStore.getInactiveCoordsForInstall.has(formattedCoords);
								const cellType = gameFieldStore.getCellType(formattedCoords, true);

								const className = cx(
									stylesCommon.td,
									stylesCommon[cellType.toLocaleLowerCase()],
									{
										[styles.canInstall]: shipsStore.activeSize && !cantInstall,
										[styles.cantInstall]: shipsStore.activeSize && cantInstall,
										[styles.hovered]: isHovered,
									},
								);

								return <td key={cI} className={className} />;
							})}
						</tr>
					))}
				</tbody>
				<ShipsInstalled />
			</table>
		</Flex>
	);
});
