/* @layer electron-main @kind logic */
import { tellWindow } from './tell-window';
import type { WidgetWindowEntry } from './widget-windows.type';

const applyPin = (entry: WidgetWindowEntry, mainOnTop: boolean): void => {
  const onTop = entry.pin === 'top' || (entry.pin === 'with-app' && mainOnTop);
  entry.win.setAlwaysOnTop(onTop, 'floating');
  tellWindow(entry);
};

export { applyPin };
