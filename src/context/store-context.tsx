import { createContext } from 'preact';
import { PropsWithChildren, useContext } from 'preact/compat';
import { observer } from 'mobx-react-lite';

import { RootStore, rootStore } from '@/store/root';

const StoreContext = createContext<RootStore>(rootStore);
const useStoreContext = () => useContext(StoreContext);

const StoreProvider = observer<PropsWithChildren>(({ children }) => (
	<StoreContext.Provider value={rootStore}>{children}</StoreContext.Provider>
));

export { useStoreContext, StoreProvider };
