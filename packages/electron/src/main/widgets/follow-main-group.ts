/* @layer electron-main @kind logic */
import type { BrowserWindow } from 'electron';
import { activeGroup } from './active-group';
import { followGroup } from './follow-group';
import { groupLayout } from './group-layout';
import { endResize } from './end-resize';
import { onWillResize } from './on-will-resize';
import { watchModifiers } from './watch-modifiers';
import { MAIN_ANCHOR } from './widget-windows.constants';

const followMainGroup = (main: BrowserWindow): void => {
  followGroup(MAIN_ANCHOR, main);
  main.on('enter-full-screen', () => {
    const group = activeGroup(MAIN_ANCHOR);
    if (group === null) return;
    setImmediate(() => {
      if (!main.isDestroyed() && main.isFullScreen()) main.setFullScreen(false);
      groupLayout.enter(group, 'fullscreen');
    });
  });
  main.on('will-resize', (event, proposed, details) => onWillResize(MAIN_ANCHOR, main, { event, proposed, edge: details.edge }));
  main.on('resized', () => endResize(MAIN_ANCHOR));
  main.on('closed', () => endResize(MAIN_ANCHOR));
  watchModifiers(main);
};

export { followMainGroup };
