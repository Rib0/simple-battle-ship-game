import 'reset-css';
import './root.css';

import { observer } from 'mobx-react-lite';
import { GameWindow } from './components/game-window';

import { StoreProvider } from './context/store-context';

export const App = observer(() => (
	<StoreProvider>
		<GameWindow />
	</StoreProvider>
));
