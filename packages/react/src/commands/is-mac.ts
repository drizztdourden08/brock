/* @layer renderer-shell @kind logic */
import { useCommandStore } from './useCommandStore';

const isMac = (): boolean => useCommandStore.getState().mac;

export { isMac };
