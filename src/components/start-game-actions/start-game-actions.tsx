import { useState } from 'preact/compat';
import { observer } from 'mobx-react-lite';
import { Flex } from 'antd';

import { SearchInput } from '@/components/common/search-input';
import { Button } from '@/components/common/button';
import { Spin } from '@/components/common/spin';

import { useSocketGameEvents } from '@/hooks/use-socket-game-events';
import { useStoreContext } from '@/context/store-context';

import { getSpinText } from './utils';

import styles from './styles.module.css';

export const StartGameActions = observer(() => {
	const [idToInvite, setIdToInvite] = useState('');
	const { shipsStore, gameStore, gameFieldStore } = useStoreContext();
	const { searchGame, cancelSearchGame, inviteById } = useSocketGameEvents();

	const { isSearching, isAwaitingInvitationResponse, playerId } = gameStore;
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

	const handleChangeIdToInvite = (value: string) => {
		setIdToInvite(value);
	};

	const handleGoToBattleClick = () => {
		setActiveSize(null);
		const trimmedId = idToInvite.trim();

		if (trimmedId) {
			inviteById(trimmedId);
		} else {
			searchGame();
		}
	};

	const isEqualInvitedPlayerId = playerId === idToInvite.trim();
	const spinText = getSpinText({ isSearching, isAwaitingInvitationResponse });
	const isSearchButtonDisabled =
		!isAllShipsInstalled || isAwaitingInvitationResponse || isEqualInvitedPlayerId;
	const isSearchingGame = isSearching || isAwaitingInvitationResponse;

	return (
		<Flex vertical gap="small">
			<Spin className={styles.spin} visible={isSearchingGame} tip={spinText} />
			<Flex gap="small">
				{isSearching ? (
					<Button type="cancel" onClick={cancelSearchGame} />
				) : (
					<Button
						disabled={isSearchButtonDisabled}
						type="start_battle"
						onClick={handleGoToBattleClick}
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
			<SearchInput onChange={handleChangeIdToInvite} value={idToInvite} />
		</Flex>
	);
});
