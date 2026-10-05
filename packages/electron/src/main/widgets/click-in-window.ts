/* @layer electron-main @kind logic */
import type { BrowserWindow } from 'electron';
import type { WidgetWindowPoint } from '@drizztdourden08/brock-core';

const centerScript = (selector: string): string =>
  `(() => { const el = document.querySelector(${JSON.stringify(selector)}); if (!el) return null; const box = el.getBoundingClientRect(); return { x: box.left + box.width / 2, y: box.top + box.height / 2 }; })()`;

const isPoint = (value: unknown): value is WidgetWindowPoint =>
  typeof value === 'object' && value !== null && 'x' in value && 'y' in value && typeof value.x === 'number' && typeof value.y === 'number';

const centerOf = async (win: BrowserWindow, selector: string): Promise<WidgetWindowPoint | null> => {
  try {
    const point: unknown = await win.webContents.executeJavaScript(centerScript(selector));
    return isPoint(point) ? point : null;
  } catch {
    return null;
  }
};

const clickInWindow = async (win: BrowserWindow | null, selector: string): Promise<boolean> => {
  if (!win) return false;
  const point = await centerOf(win, selector);
  if (!point) return false;
  const at = { x: Math.round(point.x), y: Math.round(point.y) };
  win.webContents.sendInputEvent({ type: 'mouseDown', ...at, button: 'left', clickCount: 1 });
  win.webContents.sendInputEvent({ type: 'mouseUp', ...at, button: 'left', clickCount: 1 });
  return true;
};

export { clickInWindow };
