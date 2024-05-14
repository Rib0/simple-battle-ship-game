import 'reset-css';
import './root.css';

import { StrictMode } from 'preact/compat';
import { observer } from 'mobx-react-lite';

import { SocketProvider } from './context/socket-context';
import { StoreProvider } from './context/store-context';

import { MainView } from './components/main-view';

export const App = observer(() => (
	<StrictMode>
		<SocketProvider>
			<StoreProvider>
				<MainView />
			</StoreProvider>
		</SocketProvider>
	</StrictMode>
));
