/* @layer electron-main @kind logic */
import type { BrowserWindow } from 'electron';
import type { WidgetProbeFacts, WidgetWindowBounds } from '@drizztdourden08/brock-core';
import { getMainWindow } from '../window/get-main-window';
import { anyWindow } from './any-window';
import { boundsOf } from './bounds-of';
import { clusterLayouts } from './cluster-layouts';
import { clusterOf } from './cluster-of';
import { liveEntries } from './live-entries';
import { modifierState } from './modifier-state';
import { squareState } from './square-state';
import { widgetWindowEntries } from './widget-window-entries';
import { windowGuide } from './window-guide';
import { MAIN_ANCHOR } from './widget-windows.constants';

const allBounds = (): Record<string, WidgetWindowBounds> => {
  const main = getMainWindow();
  const own: [string, WidgetWindowBounds][] = main && !main.isDestroyed() ? [[MAIN_ANCHOR, boundsOf(main)]] : [];
  return Object.fromEntries([...own, ...liveEntries().map(([id, entry]): [string, WidgetWindowBounds] => [id, boundsOf(entry.win)])]);
};

const backdropShown = (): boolean =>
  clusterLayouts.all().some((layout) => layout.backdrop !== null && !layout.backdrop.isDestroyed() && layout.backdrop.isVisible());

const shown = (win: BrowserWindow | null): boolean => win !== null && win.isVisible() && !win.isMinimized();

const ownFacts = (id: string): Pick<WidgetProbeFacts, 'visible' | 'taskbar' | 'sync' | 'square'> => {
  const win = anyWindow(id);
  if (id === MAIN_ANCHOR) return { visible: shown(win), taskbar: true, sync: true, square: squareState.main };
  const entry = widgetWindowEntries.get(id);
  const owned = win?.getParentWindow() ?? null;
  return { visible: shown(win), taskbar: entry?.taskbar === true && owned === null, sync: entry?.sync ?? true, square: entry?.square === true };
};

const probeFacts = (id: string, guideDrawn: string[] = []): WidgetProbeFacts => ({
  ...ownFacts(id),
  cluster: clusterOf(id).sort(),
  backdrop: backdropShown(),
  ctrl: modifierState.ctrl,
  guide: windowGuide.current(),
  guideIn: windowGuide.holder(),
  guideDrawn,
  area: clusterLayouts.of(id)?.area ?? null,
  windows: allBounds(),
});

export { probeFacts };
