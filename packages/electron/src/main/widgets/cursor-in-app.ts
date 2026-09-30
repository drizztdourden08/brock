/* @layer electron-main @kind logic */
import { screen } from 'electron';
import type { BrowserWindow } from 'electron';
import type { WidgetWindowPoint } from '@drizztdourden08/brock-core';
import { getMainWindow } from '../window/get-main-window';
import { pointInApp } from './point-in-app';

const cursorInApp = (win: BrowserWindow): WidgetWindowPoint | null => {
  const main = getMainWindow();
  if (!main || main.isDestroyed() || main.isMinimized() || win.isDestroyed()) return null;
  return pointInApp(screen.getCursorScreenPoint(), win.getBounds(), main.getContentBounds());
};

export { cursorInApp };
