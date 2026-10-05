/* @layer electron-main @kind logic */
import type { BrowserWindow } from 'electron';
import { activeCluster } from './active-cluster';
import { boundsOf } from './bounds-of';
import { closeAllWidgetWindows } from './close-all-widget-windows';
import { clusterTow } from './cluster-tow';
import { endMove } from './end-move';
import { flushWidgetBounds } from './flush-widget-bounds';
import { isMainNormal } from './is-main-normal';
import { followMainCluster } from './follow-main-cluster';
import { mainSnap } from './main-snap';
import { modifierRelease } from './modifier-release';
import { resizeSession } from './resize-session';
import { towCluster } from './tow-cluster';
import { towHold } from './tow-hold';
import { widgetVisibility } from './widget-visibility';
import { windowGuide } from './window-guide';
import { zStamps } from './z-stamps';
import { MAIN_ANCHOR } from './widget-windows.constants';

const parkAlone = (): void => {
  if (!activeCluster(MAIN_ANCHOR)) widgetVisibility.park();
};

const trackBounds = (main: BrowserWindow): void => {
  let normal = boundsOf(main);
  let pending = false;
  let resized = false;
  const tow = (): void => {
    pending = false;
    const quiet = resized;
    resized = false;
    if (main.isDestroyed() || main.isMinimized()) return;
    if (!isMainNormal(main)) {
      parkAlone();
      return;
    }
    const now = boundsOf(main);
    if (!towHold.held() && !quiet) towCluster(MAIN_ANCHOR, normal, now);
    normal = now;
    widgetVisibility.unpark();
  };
  const schedule = (): void => {
    resized ||= resizeSession.active() || clusterTow.active();
    if (pending) return;
    pending = true;
    setImmediate(tow);
  };
  main.on('move', schedule);
  main.on('resize', schedule);
  main.on('unmaximize', schedule);
  main.on('leave-full-screen', schedule);
  main.on('restore', schedule);
  main.on('maximize', parkAlone);
  main.on('enter-full-screen', parkAlone);
};

const trackShown = (main: BrowserWindow): void => {
  const raise = (): void => {
    zStamps.main = zStamps.next();
  };
  main.on('minimize', widgetVisibility.hideWithApp);
  main.on('hide', widgetVisibility.hideWithApp);
  main.on('restore', widgetVisibility.showWithApp);
  main.on('show', () => {
    raise();
    widgetVisibility.showWithApp();
  });
  main.on('focus', () => {
    raise();
    widgetVisibility.raiseWithApp();
  });
};

const followMainWindow = (main: BrowserWindow): void => {
  trackBounds(main);
  trackShown(main);
  followMainCluster(main);
  main.on('will-move', (event, proposed) => {
    windowGuide.touch(MAIN_ANCHOR, 'moving');
    const wanted = mainSnap.dragTo(main, proposed);
    if (!wanted) return;
    event.preventDefault();
    main.setBounds(wanted);
  });
  main.on('moved', () => {
    windowGuide.end(MAIN_ANCHOR);
    modifierRelease.afterMove();
    setImmediate(() => endMove(MAIN_ANCHOR));
  });
  main.on('close', flushWidgetBounds);
  main.on('closed', closeAllWidgetWindows);
};

export { followMainWindow };
