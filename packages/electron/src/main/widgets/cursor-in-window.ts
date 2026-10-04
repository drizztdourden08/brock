/* @layer electron-main @kind logic */
import { screen } from 'electron';
import type { BrowserWindow } from 'electron';
import type { WidgetWindowPoint } from '@drizztdourden08/brock-core';

const cursorInWindow = (win: BrowserWindow): WidgetWindowPoint | null => {
  if (win.isDestroyed()) return null;
  const cursor = screen.getCursorScreenPoint();
  const content = win.getContentBounds();
  return { x: cursor.x - content.x, y: cursor.y - content.y };
};

export { cursorInWindow };
