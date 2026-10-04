/* @layer electron-main @kind logic */
import type { BrowserWindow } from 'electron';
import { MAIN_MIN_FALLBACK } from './widget-windows.constants';
import type { MinSize } from './widget-windows.type';

const minSizeOf = (win: BrowserWindow): MinSize => {
  const [width = 0, height = 0] = win.getMinimumSize();
  return { width: width > 0 ? width : MAIN_MIN_FALLBACK.width, height: height > 0 ? height : MAIN_MIN_FALLBACK.height };
};

export { minSizeOf };
