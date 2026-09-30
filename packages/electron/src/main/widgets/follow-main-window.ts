/* @layer electron-main @kind logic */
import type { BrowserWindow } from 'electron';
import { boundsOf } from './bounds-of';
import { closeAllWidgetWindows } from './close-all-widget-windows';
import { liveEntries } from './live-entries';
import { towLinked } from './tow-linked';
import { MAIN_ANCHOR } from './widget-windows.constants';
import type { WidgetWindowEntry } from './widget-windows.type';

const followers = (): WidgetWindowEntry[] => liveEntries().map(([, entry]) => entry).filter((entry) => entry.pin === 'with-app');

const minimizeFollowers = (): void => {
  for (const entry of followers()) {
    if (entry.win.isMinimized()) continue;
    entry.hiddenWithApp = true;
    entry.win.minimize();
  }
};

const restoreFollowers = (): void => {
  for (const [, entry] of liveEntries()) {
    if (!entry.hiddenWithApp) continue;
    entry.hiddenWithApp = false;
    entry.win.restore();
  }
};

const followMainWindow = (main: BrowserWindow): void => {
  let last = boundsOf(main);
  main.on('move', () => {
    const now = boundsOf(main);
    towLinked(MAIN_ANCHOR, now.x - last.x, now.y - last.y);
    last = now;
  });
  main.on('focus', () => {
    for (const entry of followers()) entry.win.moveTop();
  });
  main.on('minimize', minimizeFollowers);
  main.on('restore', restoreFollowers);
  main.on('closed', closeAllWidgetWindows);
};

export { followMainWindow };
