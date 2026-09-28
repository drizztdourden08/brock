/* @layer electron-main @kind logic */
import { app } from 'electron';
import type { BrowserWindow, Rectangle } from 'electron';
import type { HandlerGroup } from '../types/main-context.type';

let lockedRatio = 0;
let lockedExtraHeight = 0;

const snapToRatio = (win: BrowserWindow, ratio: number, extraHeight: number): void => {
  const [w = 0, h = 0] = win.getSize();
  const contentH = h - extraHeight;
  const wForH = Math.round(contentH * ratio);
  const hForW = Math.round(w / ratio) + extraHeight;

  if (wForH <= w) {
    win.setSize(wForH, h);
    const [aw = 0] = win.getSize();
    if (aw > w) win.setSize(w, h);
  } else if (hForW <= h) {
    win.setSize(w, hForW);
    const [, ah = 0] = win.getSize();
    if (ah > h) win.setSize(w, h);
  }
};

const fitBounds = (bounds: Rectangle, edge: string): { width: number; height: number } | null => {
  if (edge === 'left' || edge === 'right') {
    return { width: bounds.width, height: Math.round(bounds.width / lockedRatio) + lockedExtraHeight };
  }
  if (edge === 'bottom' || edge === 'top') {
    return { width: Math.round((bounds.height - lockedExtraHeight) * lockedRatio), height: bounds.height };
  }
  const wForH = Math.round((bounds.height - lockedExtraHeight) * lockedRatio);
  const hForW = Math.round(bounds.width / lockedRatio) + lockedExtraHeight;
  const fitsW = wForH <= bounds.width;
  const fitsH = hForW <= bounds.height;
  if (fitsW && fitsH) {
    return wForH * bounds.height >= bounds.width * hForW
      ? { width: wForH, height: bounds.height }
      : { width: bounds.width, height: hForW };
  }
  if (fitsW) return { width: wForH, height: bounds.height };
  if (fitsH) return { width: bounds.width, height: hForW };
  return null;
};

const enforceOnResize = (win: BrowserWindow): void => {
  win.on('will-resize', (e, newBounds, details) => {
    if (lockedRatio <= 0) return;
    const edge: string = details.edge;
    const target = fitBounds(newBounds, edge);
    if (!target) {
      e.preventDefault();
      return;
    }
    if (target.width === newBounds.width && target.height === newBounds.height) return;

    e.preventDefault();
    const cur = win.getBounds();
    const x = edge.includes('left') ? cur.x + cur.width - target.width : newBounds.x;
    const y = edge.includes('top') ? cur.y + cur.height - target.height : newBounds.y;
    win.setBounds({ x, y, width: target.width, height: target.height });
  });
};

const aspectRatioHandlers: HandlerGroup = {
  id: 'aspectRatio',
  register: ({ on, window }) => {
    on('window:setAspectRatioLock', (_e, ratio, extraHeight) => {
      const win = window();
      if (!win) return;
      lockedRatio = ratio;
      lockedExtraHeight = extraHeight;
      if (ratio <= 0) {
        win.setAspectRatio(0);
        return;
      }
      snapToRatio(win, ratio, extraHeight);
    });
    app.on('browser-window-created', (_event, win) => enforceOnResize(win));
  },
};

export { aspectRatioHandlers };
