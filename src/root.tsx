import 'reset-css';
import './root.css';

import { StrictMode } from 'preact/compat';
import { observer } from 'mobx-react-lite';

import { SocketProvider } from './context/socket-context';
import { StoreProvider } from './context/store-context';

import { App } from './components/app';

export const Root = observer(() => (
	<StrictMode>
		<SocketProvider>
			<StoreProvider>
				<App />
			</StoreProvider>
		</SocketProvider>
	</StrictMode>
));
