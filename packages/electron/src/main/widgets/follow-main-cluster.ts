/* @layer electron-main @kind logic */
import type { BrowserWindow } from 'electron';
import { activeCluster } from './active-cluster';
import { clusterLayout } from './cluster-layout';
import { endResize } from './end-resize';
import { followCluster } from './follow-cluster';
import { modifierRelease } from './modifier-release';
import { onWillResize } from './on-will-resize';
import { watchModifiers } from './watch-modifiers';
import { windowGuide } from './window-guide';
import { MAIN_ANCHOR } from './widget-windows.constants';

const followMainCluster = (main: BrowserWindow): void => {
  followCluster(MAIN_ANCHOR, main);
  main.on('enter-full-screen', () => {
    if (!activeCluster(MAIN_ANCHOR)) return;
    setImmediate(() => {
      if (!main.isDestroyed() && main.isFullScreen()) main.setFullScreen(false);
      clusterLayout.enter(MAIN_ANCHOR, 'fullscreen');
    });
  });
  main.on('will-resize', (event, proposed, details) => {
    windowGuide.touch(MAIN_ANCHOR, 'resizing');
    onWillResize(MAIN_ANCHOR, main, { event, proposed, edge: details.edge });
  });
  main.on('resized', () => {
    endResize(MAIN_ANCHOR);
    windowGuide.end(MAIN_ANCHOR);
    modifierRelease.afterResize();
  });
  main.on('closed', () => endResize(MAIN_ANCHOR));
  watchModifiers(main);
};

export { followMainCluster };
