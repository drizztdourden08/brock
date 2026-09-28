/* @layer renderer-shell @kind logic */
import { createContext } from 'react';
import type { SettingsStore } from './settings-store.type';

const SettingsStoreContext = createContext<SettingsStore<object> | null>(null);

export { SettingsStoreContext };
