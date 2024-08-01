export const getSpinText = ({
	isSearching,
	isAwaitingInvitationResponse,
}: {
	isSearching: boolean;
	isAwaitingInvitationResponse: boolean;
}) => {
	if (isSearching) {
		return 'Поиск игры';
	}

	if (isAwaitingInvitationResponse) {
		return 'Ожидание ответа игрока';
	}

	return '';
};
