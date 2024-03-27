import 'reset-css';
import './root.css';

import { FunctionComponent } from 'preact';
import { GameWindow } from './components/game-window';

import { StoreProvider } from './context/store-context';

export const App: FunctionComponent = () => (
	<StoreProvider>
		<GameWindow />
	</StoreProvider>
);
