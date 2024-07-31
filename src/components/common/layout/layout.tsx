import { PropsWithChildren } from 'preact/compat';
import { observer } from 'mobx-react-lite';
import { Flex } from 'antd';

import { Header } from '../header';

import styles from './styles.module.css';

export const Layout = observer<PropsWithChildren>(({ children }) => (
	<Flex vertical gap="small">
		<Header />
		<div className={styles.main}>{children}</div>
	</Flex>
));
