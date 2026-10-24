/* @layer renderer-shell @kind hook */
import { useCommandStore } from './useCommandStore';

const useIsMac = (): boolean => useCommandStore((state) => state.mac);

export { useIsMac };
