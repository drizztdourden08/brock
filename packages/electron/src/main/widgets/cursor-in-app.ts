/* @layer electron-main @kind logic */
import { screen } from 'electron';
import type { BrowserWindow } from 'electron';
import type { WidgetWindowPoint } from '@drizztdourden08/brock-core';
import { dropPointAt } from './drop-point-at';

const cursorInApp = (id: string, win: BrowserWindow): WidgetWindowPoint | null =>
  (win.isDestroyed() ? null : dropPointAt(id, screen.getCursorScreenPoint(), win.getBounds()));

export { cursorInApp };
