import { FunctionComponent } from 'preact';
import { observer } from 'mobx-react-lite';

import { Ship } from '@/components/ship';
import { useStoreContext } from '@/context/store-context';
import { ShipSize } from '@/types/ship';

import styles from './styles.module.css';

const SHIPS_STRUCTURE = [
	[ShipSize.ONE, ShipSize.FOUR],
	[ShipSize.TWO, ShipSize.THREE],
];

export const ShipsForInstall: FunctionComponent = observer(() => {
	const { shipsStore } = useStoreContext();

	const handleClick = (shipSize: ShipSize) => {
		shipsStore.setActiveSize(shipSize);
	};

	return (
		<div>
			{SHIPS_STRUCTURE.map((row) => (
				<div className={styles.row}>
					{row.map((size) => (
						<Ship
							onClick={handleClick}
							size={size}
							amount={shipsStore.shipsAmount[size]}
							className={shipsStore.shipsAmount[size] === 0 ? styles.invisible : ''}
						/>
					))}
				</div>
			))}
		</div>
	);
});
