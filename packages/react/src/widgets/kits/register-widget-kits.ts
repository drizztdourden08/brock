/* @layer renderer-shell @kind logic */
import { useKitRegistryStore } from './useKitRegistryStore';
import type { WidgetKitDef } from './widget-kit.type';

const registerWidgetKits = (kits: readonly WidgetKitDef[]): (() => void) => useKitRegistryStore.getState().add(kits);

export { registerWidgetKits };
