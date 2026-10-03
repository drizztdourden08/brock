/* @layer electron-main @kind logic */
import type { WidgetDockBack } from '@drizztdourden08/brock-core';
import { widgetWindowEntries } from './widget-window-entries';

const closeWidgetWindow = (id: string, where?: WidgetDockBack): void => {
  const entry = widgetWindowEntries.get(id);
  if (!entry || entry.win.isDestroyed()) return;
  entry.closing = { where };
  entry.win.close();
};

export { closeWidgetWindow };
