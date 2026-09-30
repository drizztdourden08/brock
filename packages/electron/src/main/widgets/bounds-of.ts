/* @layer electron-main @kind logic */
import type { BrowserWindow } from 'electron';
import type { WidgetWindowBounds } from '@drizztdourden08/brock-core';

const boundsOf = (win: BrowserWindow): WidgetWindowBounds => {
  const { x, y, width, height } = win.getBounds();
  return { x, y, width, height };
};

export { boundsOf };
