import { useState } from 'preact/compat';
import { observer } from 'mobx-react-lite';
import { Flex } from 'antd';

import { Button } from '@/components/common/button';
import { SearchInput } from '@/components/common/search-input';

import { useSocketGameEvents } from '@/hooks/use-socket-game-events';
import { useStoreContext } from '@/context/store-context';

import styles from './styles.module.css';

export const StartGameActions = observer(() => {
	const [idToInvite, setIdToInvite] = useState('');
	const { shipsStore, gameFieldStore } = useStoreContext();
	const { searchGame, inviteById } = useSocketGameEvents();

	const { activeSize, rotateActiveShip, setActiveSize, isAllShipsInstalled } = shipsStore;
	const {
		activeInstalledShipCoords,
		removeActiveInstalledShip,
		randomlyInstallShips,
		resetAllShips,
	} = gameFieldStore;

	const handleClickCancelButton = () => {
		if (activeSize) {
			setActiveSize(null);
		} else if (activeInstalledShipCoords) {
			removeActiveInstalledShip();
		} else if (isAllShipsInstalled) {
			resetAllShips();
		}
	};

	const handleChangeIdToInvite = (value: string) => {
		setIdToInvite(value);
	};

	const handleGoToBattleClick = () => {
		const trimmedId = idToInvite.trim();

		if (trimmedId) {
			inviteById(trimmedId);
		} else {
			searchGame();
		}
	};

	return (
		<Flex vertical gap="small">
			<Flex gap="small">
				{!activeSize && !activeInstalledShipCoords && (
					<Button type="shuffle_ships" onClick={randomlyInstallShips} />
				)}
				{activeSize && <Button type="rotate_ship" onClick={rotateActiveShip} />}
				{(activeSize || activeInstalledShipCoords || isAllShipsInstalled) && (
					<Button type="cancel" onClick={handleClickCancelButton} />
				)}
			</Flex>
			<Flex
				vertical
				gap="small"
				className={!isAllShipsInstalled ? styles.inactive : undefined}
			>
				<Button type="start_battle" onClick={handleGoToBattleClick} />
				<SearchInput onChange={handleChangeIdToInvite} value={idToInvite} />
			</Flex>
		</Flex>
	);
});
