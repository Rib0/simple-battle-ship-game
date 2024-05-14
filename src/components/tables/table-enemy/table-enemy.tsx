import { observer } from 'mobx-react-lite';
import cx from 'classnames';

import { fieldSideArray } from '@/components/tables/constants';
import { useSocketGameEvents } from '@/hooks/use-socket-game-events';
import { formatCoords } from '@/utils/table';

import stylesCommon from '@/components/tables/styles.module.css';

/* eslint-disable react/no-array-index-key */
/* eslint-disable jsx-a11y/control-has-associated-label */

export const TableEnemy = observer(() => {
	const { attack } = useSocketGameEvents();

	const handleClick = (e: MouseEvent) => {
		if (!(e?.target instanceof HTMLTableCellElement)) {
			return;
		}

		const coords = e.target.dataset.coords as string;

		attack(coords);
	};

	return (
		<table className={stylesCommon.table}>
			<tbody>
				{fieldSideArray.map((_, rI) => (
					<tr key={rI} className={stylesCommon.tr}>
						{fieldSideArray.map((__, cI) => {
							const className = cx(stylesCommon.td);

							return (
								<td
									key={cI}
									data-coords={formatCoords({ x: cI, y: rI })}
									onClick={handleClick}
									className={className}
								/>
							);
						})}
					</tr>
				))}
			</tbody>
		</table>
	);
});
