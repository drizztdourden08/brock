/* @layer renderer-shell @kind logic */
import { createDefaultLayout, hideToolbar } from '@drizztdourden08/tessera/composites';
import { useToolbarLayoutStore } from '../toolbars/useToolbarLayoutStore';
import { useWidgetKitStore } from './kits/useWidgetKitStore';
import { useFocusModeStore } from './useFocusModeStore';
import { useWidgetLayoutStore } from './useWidgetLayoutStore';

const enter = (): void => {
  if (useFocusModeStore.getState().on) return;
  const widgets = useWidgetLayoutStore.getState();
  const toolbars = useToolbarLayoutStore.getState();
  const kits = useWidgetKitStore.getState();
  useFocusModeStore.setState({ on: true, saved: { widgets: widgets.layout, toolbars: toolbars.layout, kit: kits.active } });
  if (kits.active !== null) kits.close();
  widgets.setLayout(createDefaultLayout());
  toolbars.setLayout(toolbars.definitions.reduce((layout, def) => hideToolbar(layout, def.id), toolbars.layout));
};

const leave = (): void => {
  const { on, saved } = useFocusModeStore.getState();
  if (!on || saved === null) return;
  useFocusModeStore.setState({ on: false, saved: null });
  useWidgetLayoutStore.getState().setLayout(saved.widgets);
  useToolbarLayoutStore.getState().setLayout(saved.toolbars);
  if (saved.kit !== null) useWidgetKitStore.getState().open(saved.kit);
};

const focusMode = (on?: boolean): boolean => {
  const next = on ?? !useFocusModeStore.getState().on;
  if (next) enter();
  else leave();
  return useFocusModeStore.getState().on;
};

export { focusMode };
