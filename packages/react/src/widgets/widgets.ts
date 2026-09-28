/* @layer renderer-shell @kind logic */
import { useWidgetLayoutStore } from './useWidgetLayoutStore';

const widgets = {
  open: (id: string): void => useWidgetLayoutStore.getState().open(id),
  close: (id: string): void => useWidgetLayoutStore.getState().close(id),
  toggle: (id: string): void => useWidgetLayoutStore.getState().toggle(id),
  isVisible: (id: string): boolean => useWidgetLayoutStore.getState().layout.widgets.some((w) => w.id === id && w.visible),
};

export { widgets };
