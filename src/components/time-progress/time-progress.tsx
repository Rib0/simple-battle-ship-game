import { useMemo } from 'preact/hooks';
import { observer } from 'mobx-react-lite';
import { Progress } from 'antd';

import { useStoreContext } from '@/context/store-context';

const COLORS = {
	red: '#ec2121',
	yellow: '#e9c811',
	green: '#20ca20',
};

export const TimeProgress = observer(() => {
	const { gameStore } = useStoreContext();

	const percent = gameStore.getDiffTurnStartTimeInPercent;

	const color = useMemo(() => {
		if (percent < 33) {
			return COLORS.red;
		}
		if (percent < 66) {
			return COLORS.yellow;
		}
		return COLORS.green;
	}, [percent]);

	return (
		<Progress
			aria-label="progress"
			aria-labelledby="progress"
			format={(value) => value}
			percent={percent}
			showInfo={false}
			strokeColor={color}
		/>
	);
});
