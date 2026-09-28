/* @layer renderer-shell @kind logic */
import type { WidgetDef } from './widget.type';
import { useWidgetRegistryStore } from './useWidgetRegistryStore';

const registerWidgets = (definitions: readonly WidgetDef[]): (() => void) =>
  useWidgetRegistryStore.getState().add(definitions);

export { registerWidgets };
