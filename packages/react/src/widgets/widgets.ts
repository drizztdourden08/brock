/* @layer renderer-shell @kind logic */
import { forcedWidgets } from './forced-widgets';
import { useWidgetLayoutStore } from './useWidgetLayoutStore';
import { widgetBodyHolds } from './widget-body-holds';
import { widgetVisible } from './widget-visible';

const opening = (change: (id: string) => void) => (id: string): void => {
  change(id);
  widgetBodyHolds.widgets([id]);
};

const widgets = {
  open: opening((id) => useWidgetLayoutStore.getState().open(id)),
  close: (id: string): void => useWidgetLayoutStore.getState().close(id),
  toggle: opening((id) => useWidgetLayoutStore.getState().toggle(id)),
  popOut: (id: string): void => useWidgetLayoutStore.getState().popOut(id),
  reset: (): void => useWidgetLayoutStore.getState().reset(),
  force: (ids: readonly string[]): void => forcedWidgets.force(ids),
  isVisible: widgetVisible,
};

export { widgets };
