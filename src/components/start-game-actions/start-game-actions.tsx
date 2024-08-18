import { observer } from 'mobx-react-lite';
import { Flex } from 'antd';

import { Button } from '@/components/common/button';
import { Spin } from '@/components/common/spin';

import { useSocketGameEvents } from '@/hooks/use-socket-game-events';
import { useStoreContext } from '@/context/store-context';

import { getSpinText } from './utils';

import styles from './styles.module.css';

export const StartGameActions = observer(() => {
	const { shipsStore, gameStore, gameFieldStore } = useStoreContext();
	const { searchGame, cancelSearchGame } = useSocketGameEvents();

	const { isSearching, isAwaitingInvitationResponse } = gameStore;
	const { activeSize, rotateActiveShip, setActiveSize, isAllShipsInstalled } = shipsStore;
	const {
		activeInstalledShipCoords,
		removeActiveInstalledShip,
		randomlyInstallShips,
		resetAllShips,
	} = gameFieldStore;

	const handleResetShipsClick = () => {
		if (activeSize) {
			setActiveSize(null);
		} else if (activeInstalledShipCoords) {
			removeActiveInstalledShip();
		} else if (isAllShipsInstalled) {
			resetAllShips();
		}
	};

	const handleSearchGame = () => {
		setActiveSize(null);

		searchGame();
	};

	const spinText = getSpinText({ isSearching, isAwaitingInvitationResponse });
	const isSearchingGame = isSearching || isAwaitingInvitationResponse;

	return (
		<Flex vertical gap="small">
			<Spin className={styles.spin} visible={isSearchingGame} tip={spinText} />
			<Flex gap="small">
				{isSearching ? (
					<Button type="cancel" onClick={cancelSearchGame} />
				) : (
					<Button
						disabled={!isAllShipsInstalled}
						type="start_battle"
						onClick={handleSearchGame}
					/>
				)}
				{!isSearchingGame && (
					<>
						{!activeSize && !activeInstalledShipCoords && (
							<Button type="shuffle_ships" onClick={randomlyInstallShips} />
						)}
						{activeSize && <Button type="rotate_ship" onClick={rotateActiveShip} />}
						{(activeSize || activeInstalledShipCoords || isAllShipsInstalled) && (
							<Button type="cancel" onClick={handleResetShipsClick} />
						)}
					</>
				)}
			</Flex>
		</Flex>
	);
});
