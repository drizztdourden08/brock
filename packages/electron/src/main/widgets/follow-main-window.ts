/* @layer electron-main @kind logic */
import type { BrowserWindow } from 'electron';
import { activeGroup } from './active-group';
import { boundsOf } from './bounds-of';
import { closeAllWidgetWindows } from './close-all-widget-windows';
import { flushWidgetBounds } from './flush-widget-bounds';
import { isMainNormal } from './is-main-normal';
import { followMainGroup } from './follow-main-group';
import { mainSnap } from './main-snap';
import { towHold } from './tow-hold';
import { towLinked } from './tow-linked';
import { widgetVisibility } from './widget-visibility';
import { zStamps } from './z-stamps';
import { MAIN_ANCHOR } from './widget-windows.constants';

const parkAlone = (): void => {
  if (activeGroup(MAIN_ANCHOR) === null) widgetVisibility.park();
};

const trackBounds = (main: BrowserWindow): void => {
  let normal = boundsOf(main);
  let pending = false;
  const tow = (): void => {
    pending = false;
    if (main.isDestroyed() || main.isMinimized()) return;
    if (!isMainNormal(main)) {
      parkAlone();
      return;
    }
    const now = boundsOf(main);
    if (!towHold.held()) towLinked(MAIN_ANCHOR, normal, now);
    normal = now;
    widgetVisibility.unpark();
  };
  const schedule = (): void => {
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
  followMainGroup(main);
  main.on('will-move', (event, proposed) => {
    const wanted = mainSnap.dragTo(main, proposed);
    if (!wanted) return;
    event.preventDefault();
    main.setBounds(wanted);
  });
  main.on('moved', mainSnap.settle);
  main.on('close', flushWidgetBounds);
  main.on('closed', closeAllWidgetWindows);
};

export { followMainWindow };
