/* @layer electron-main @kind logic */
import type { BrowserWindow } from 'electron';
import type { HandlerGroup } from '../types/main-context.type';
import { aspectLock } from './aspect-lock';

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

const aspectRatioHandlers: HandlerGroup = {
  id: 'aspectRatio',
  register: ({ on, window }) => {
    on('window:setAspectRatioLock', (_e, ratio, extraHeight) => {
      const win = window();
      if (!win) return;
      aspectLock.set({ ratio: Math.max(ratio, 0), extraHeight });
      if (ratio <= 0) {
        win.setAspectRatio(0);
        return;
      }
      snapToRatio(win, ratio, extraHeight);
    });
  },
};

export { aspectRatioHandlers };
