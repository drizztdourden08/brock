/* @layer renderer-shell @kind logic */
import { isWidgetOpen } from '@drizztdourden08/tessera/composites';
import { kitRoute } from './kits/kit-route';
import { useWidgetLayoutStore } from './useWidgetLayoutStore';

const visible = (id: string): boolean => {
  if (!kitRoute.isMember(id)) return isWidgetOpen(useWidgetLayoutStore.getState().layout, id);
  const layout = kitRoute.openLayoutOf(id);
  return layout !== null && isWidgetOpen(layout, id);
};

const widgets = {
  open: (id: string): void => useWidgetLayoutStore.getState().open(id),
  close: (id: string): void => useWidgetLayoutStore.getState().close(id),
  toggle: (id: string): void => useWidgetLayoutStore.getState().toggle(id),
  popOut: (id: string): void => useWidgetLayoutStore.getState().popOut(id),
  reset: (): void => useWidgetLayoutStore.getState().reset(),
  isVisible: visible,
};

export { widgets };
