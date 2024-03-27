import { FunctionComponent } from 'preact';
import { observer } from 'mobx-react-lite';

import { Ship } from '@/components/ship';
import { useStoreContext } from '@/context/store-context';
import { getShipsStylesRelativeToTableWithRotation } from '@/utils/ship';

export const ShipsInstalled: FunctionComponent = observer(() => {
	const { gameFieldStore } = useStoreContext();

	const renderShips = () =>
		Object.entries(gameFieldStore.ships).map(([coords, { size, rotation }]) => {
			const { x, y } = getShipsStylesRelativeToTableWithRotation({ coords, size, rotation });

			const style = {
				position: 'absolute',
				top: `${y}px`,
				left: `${x}px`,
			};

			return <Ship size={size} rotation={rotation} style={style} />;
		});

	return <>{renderShips()}</>;
});
