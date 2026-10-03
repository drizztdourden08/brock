/* @layer electron-main @kind logic */
import type { WidgetWindowBounds } from '@drizztdourden08/brock-core';
import type { WidgetWindowEntry } from './widget-windows.type';

const moveEntry = (entry: WidgetWindowEntry, bounds: WidgetWindowBounds): void => {
  entry.towed = true;
  entry.win.setBounds(bounds);
  entry.last = bounds;
  entry.towed = false;
  entry.report.schedule();
};

export { moveEntry };
