/* @layer renderer-shell @kind logic */
import { isWidgetOpen } from '@drizztdourden08/tessera/composites';
import { useWidgetLayoutStore } from './useWidgetLayoutStore';

const widgets = {
  open: (id: string): void => useWidgetLayoutStore.getState().open(id),
  close: (id: string): void => useWidgetLayoutStore.getState().close(id),
  toggle: (id: string): void => useWidgetLayoutStore.getState().toggle(id),
  popOut: (id: string): void => useWidgetLayoutStore.getState().popOut(id),
  reset: (): void => useWidgetLayoutStore.getState().reset(),
  isVisible: (id: string): boolean => isWidgetOpen(useWidgetLayoutStore.getState().layout, id),
};

export { widgets };
