import { CSSProperties } from 'preact/compat';
import { observer } from 'mobx-react-lite';
import { Flex } from 'antd';

import { Ship } from '@/components/ship';
import { DndDraggable } from '@/components/common/drag-and-drop';
import { useStoreContext } from '@/context/store-context';
import { getShipRotationStyles } from '@/utils/ship';
import { ShipSize } from '@/types/ship';

import styles from './styles.module.css';

const SHIPS_STRUCTURE = [
	[ShipSize.ONE, ShipSize.FOUR],
	[ShipSize.TWO, ShipSize.THREE],
];

export const ShipsForInstall = observer(() => {
	const { shipsStore } = useStoreContext();
	const { activeSize, shipsAmount, activeSizeRotation } = shipsStore;

	const extendDraggableStyles = (style: CSSProperties): CSSProperties => ({
		...style,
		transform: `${style.transform || ''} ${getShipRotationStyles(activeSizeRotation)}`,
	});

	const handleClick = (shipSize: ShipSize) => {
		shipsStore.setActiveSize(shipSize);
	};

	return (
		<Flex vertical flex="1">
			<Flex gap="small" vertical>
				{SHIPS_STRUCTURE.map((row) => (
					<Flex>
						{row.map((size) => (
							<Ship
								onClick={handleClick}
								size={size}
								amount={shipsAmount[size]}
								invisible={shipsAmount[size] === 0}
							/>
						))}
					</Flex>
				))}
			</Flex>
			<Flex flex="1">
				{activeSize && (
					<DndDraggable
						className={styles.draggable}
						extendDraggableStyles={extendDraggableStyles}
						containerDataProps={{
							'data-size': activeSize as unknown as string,
							'data-rotation': activeSizeRotation as unknown as string,
						}}
					>
						<Ship size={activeSize} />
					</DndDraggable>
				)}
			</Flex>
		</Flex>
	);
});
