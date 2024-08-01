import { observer } from 'mobx-react-lite';
import { Spin as SpinAntd } from 'antd';

import styles from './styles.module.css';

type Props = {
	visible: boolean;
	tip?: string;
};

export const Spin = observer<Props>(({ visible, tip }) => (
	<SpinAntd size="small" spinning={visible} tip={tip}>
		<div className={styles.content} />
	</SpinAntd>
));
