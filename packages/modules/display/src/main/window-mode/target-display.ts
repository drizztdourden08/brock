/* @layer electron-main @kind logic */
import { screen } from 'electron';
import type { BrowserWindow, Display } from 'electron';

const targetDisplay = (win: BrowserWindow, monitorId: string | null): Display => {
  const chosen = monitorId ? screen.getAllDisplays().find((display) => String(display.id) === monitorId) : undefined;
  return chosen ?? screen.getDisplayMatching(win.getBounds());
};

export { targetDisplay };
