/* @layer electron-main @kind logic */
import type { BrowserWindow } from 'electron';

const guarded = new WeakSet<BrowserWindow>();

const closeGuardState = {
  set: (win: BrowserWindow, on: boolean): void => {
    if (on) guarded.add(win);
    else guarded.delete(win);
  },
  has: (win: BrowserWindow): boolean => guarded.has(win),
};

export { closeGuardState };
