/* @layer renderer-shell @kind hook */
import { useActiveWidgetStore } from './useActiveWidgetStore';

const useActiveWidget = (): string | null => useActiveWidgetStore((s) => s.id);

export { useActiveWidget };
