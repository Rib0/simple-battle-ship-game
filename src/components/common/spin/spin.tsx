import { observer } from 'mobx-react-lite';
import { Spin as SpinAntd } from 'antd';

import styles from './styles.module.css';

type Props = {
	visible: boolean;
	tip?: string;
	className?: string;
};

export const Spin = observer<Props>(({ visible, tip, className }) => (
	<SpinAntd wrapperClassName={className} spinning={visible} tip={tip}>
		<div className={styles.content} />
	</SpinAntd>
));
