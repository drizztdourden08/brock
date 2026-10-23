/* @layer electron-main @kind logic */
import type { BrowserWindow } from 'electron';

const approved = new WeakSet<BrowserWindow>();

const closeApproval = {
  grant: (win: BrowserWindow): void => {
    approved.add(win);
  },
  take: (win: BrowserWindow): boolean => approved.delete(win),
};

export { closeApproval };
