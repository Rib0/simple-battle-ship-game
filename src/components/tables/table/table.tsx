import { observer } from 'mobx-react-lite';
import cx from 'classnames';

import { ShipsInstalled } from '@/components/ships-installed';
import { formatCoords } from '@/utils/table';
import { useStoreContext } from '@/context/store-context';
import { Nullable } from '@/types/utils';
import { fieldSideArray } from '@/components/tables/constants';

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
		<table className={stylesCommon.table}>
			<tbody>
				{fieldSideArray.map((_, rI) => (
					<tr key={rI} className={stylesCommon.tr}>
						{fieldSideArray.map((__, cI) => {
							const formattedCoords = formatCoords({ x: cI, y: rI });

							const isHovered = hoveredCoords?.includes(formattedCoords);
							const cantInstall =
								gameFieldStore.getInactiveCoordsForInstall.has(formattedCoords);

							const className = cx(stylesCommon.td, {
								[styles.hovered]: isHovered,
								[styles.cantInstall]: shipsStore.activeSize && cantInstall,
								[styles.canInstall]: shipsStore.activeSize && !cantInstall,
							});

							return <td key={cI} className={className} />;
						})}
					</tr>
				))}
			</tbody>
			<ShipsInstalled />
		</table>
	);
});
