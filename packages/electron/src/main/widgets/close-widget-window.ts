/* @layer electron-main @kind logic */
import type { WidgetDockBack } from '@drizztdourden08/brock-core';
import { widgetWindowClosing } from './widget-window-closing';
import { widgetWindowEntries } from './widget-window-entries';

const closeWidgetWindow = (id: string, where?: WidgetDockBack): void => {
  const win = widgetWindowEntries.get(id)?.win;
  if (!win || win.isDestroyed()) return;
  widgetWindowClosing.set(id, where);
  win.close();
};

export { closeWidgetWindow };
