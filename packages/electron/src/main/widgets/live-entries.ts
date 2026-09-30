/* @layer electron-main @kind logic */
import { widgetWindowEntries } from './widget-window-entries';
import type { WidgetWindowEntry } from './widget-windows.type';

const liveEntries = (): [string, WidgetWindowEntry][] =>
  [...widgetWindowEntries].filter(([, entry]) => !entry.win.isDestroyed());

export { liveEntries };
