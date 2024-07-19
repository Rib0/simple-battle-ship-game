import { observer } from 'mobx-react-lite';
import { Flex } from 'antd';
import cx from 'classnames';

import { FIELD_SIDE_ARRAY } from '@/components/tables/constants';
import { useSocketGameEvents } from '@/hooks/use-socket-game-events';
import { formatCoords } from '@/utils/table';

import { useStoreContext } from '@/context/store-context';
import { CellType } from '@/types/game-field';

import stylesCommon from '@/components/tables/styles.module.css';
import styles from './styles.module.css';

/* eslint-disable react/no-array-index-key */
/* eslint-disable jsx-a11y/control-has-associated-label */

export const TableEnemy = observer(() => {
	const { gameStore, gameFieldStore } = useStoreContext();
	const { attack } = useSocketGameEvents();

	const handleClick = (e: MouseEvent) => {
		if (!(e?.target instanceof HTMLTableCellElement)) {
			return;
		}

		const coords = e.target.dataset.coords as string;

		attack(coords);
	};

	return (
		<Flex vertical>
			<table className={cx(stylesCommon.table, !gameStore.isEnemyOnline && styles.inactive)}>
				<tbody>
					{FIELD_SIDE_ARRAY.map((_, rI) => (
						<tr key={rI} className={stylesCommon.tr}>
							{FIELD_SIDE_ARRAY.map((__, cI) => {
								const formattedCoords = formatCoords({ x: cI, y: rI });

								const canAttack =
									gameFieldStore.canAttackEnemyCell(formattedCoords);
								const cellType = gameFieldStore.getCellType(formattedCoords, false);
								const isDisabled = [CellType.BOMB, CellType.DAMAGED].includes(
									cellType,
								);

								const className = cx(
									canAttack && styles.canAttack,
									stylesCommon.td,
									stylesCommon[cellType.toLowerCase()],
								);

								return (
									<td
										disabled={isDisabled}
										key={cI}
										data-coords={formattedCoords}
										onClick={handleClick}
										className={className}
									/>
								);
							})}
						</tr>
					))}
				</tbody>
			</table>
		</Flex>
	);
});
