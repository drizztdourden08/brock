/* @layer electron-main @kind logic */
import type { WidgetWindowState } from '@drizztdourden08/brock-core';
import type { WidgetWindowEntry } from './widget-windows.type';

const windowStateOf = (entry: WidgetWindowEntry): WidgetWindowState => ({
  pin: entry.pin, onTop: entry.win.isAlwaysOnTop(), snap: entry.snap, link: entry.link, sync: entry.sync, group: entry.group, square: entry.square,
});

export { windowStateOf };
