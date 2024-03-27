import { FunctionComponent, createContext } from 'preact';
import { PropsWithChildren, useContext } from 'preact/compat';

import { RootStore, rootStore } from '@/store/root';

const StoreContext = createContext<RootStore>({} as RootStore);
const useStoreContext = () => useContext(StoreContext);

const StoreProvider: FunctionComponent<PropsWithChildren> = ({ children }) => (
	<StoreContext.Provider value={rootStore}>{children}</StoreContext.Provider>
);

export { useStoreContext, StoreProvider };
