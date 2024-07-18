import { JSX, useState } from 'preact/compat';
import { observer } from 'mobx-react-lite';
import { Flex, Input } from 'antd';

import { Button } from '@/components/common/button';

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

	const handleChangeIdToInvite = (e: JSX.TargetedEvent<HTMLInputElement, Event>) => {
		if (!(e?.target instanceof HTMLInputElement)) {
			return;
		}

		const { value } = e.target;

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
		<Flex wrap gap="middle" className={styles.root}>
			{!activeSize && !activeInstalledShipCoords && (
				<Button type="shuffle_ships" onClick={randomlyInstallShips} />
			)}
			{activeSize && <Button type="rotate_ship" onClick={rotateActiveShip} />}
			{(activeSize || activeInstalledShipCoords || isAllShipsInstalled) && (
				<Button type="cancel" onClick={handleClickCancelButton} />
			)}
			<Flex
				flex="0 0 100%"
				align="center"
				className={!isAllShipsInstalled ? styles.inactive : undefined}
			>
				<Button type="start_battle" onClick={handleGoToBattleClick} />
				<Input
					value={idToInvite}
					onChange={handleChangeIdToInvite}
					placeholder="Пригласить по id"
					size="middle"
				/>
			</Flex>
		</Flex>
	);
});
