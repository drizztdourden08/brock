/* @layer renderer-shell @kind hook */
import { useWidgetPrefStore } from '../stores/useWidgetPrefStore';

const useWidgetStateReady = (): boolean => useWidgetPrefStore((s) => s.hydrated);

export { useWidgetStateReady };
