/* @layer electron-main @kind logic */
import { activeCluster } from './active-cluster';
import { clusterLayout } from './cluster-layout';
import { clusterVisibility } from './cluster-visibility';
import { MAIN_ANCHOR } from './widget-windows.constants';
import type { LayoutMode } from './widget-windows.type';

const laidOut = (): LayoutMode => clusterLayout.modeOf(MAIN_ANCHOR);

const maximize = (): boolean => {
  if (laidOut() !== 'normal') return clusterLayout.toggle(MAIN_ANCHOR, 'maximized');
  return activeCluster(MAIN_ANCHOR) && clusterLayout.enter(MAIN_ANCHOR, 'maximized');
};

const fullscreen = (on?: boolean): boolean => {
  const mode = laidOut();
  const wanted = on ?? mode !== 'fullscreen';
  if (!wanted) return mode === 'fullscreen' && clusterLayout.restore(MAIN_ANCHOR);
  if (mode === 'fullscreen') return true;
  return activeCluster(MAIN_ANCHOR) && clusterLayout.enter(MAIN_ANCHOR, 'fullscreen');
};

const minimize = (): boolean => {
  if (!activeCluster(MAIN_ANCHOR)) return false;
  clusterVisibility.minimize(MAIN_ANCHOR);
  return true;
};

const stateOf = (mode: LayoutMode): boolean | null => (laidOut() === 'normal' ? null : laidOut() === mode);

const mainClusterControl = {
  maximize, fullscreen, minimize, isMaximized: (): boolean | null => stateOf('maximized'), isFullscreen: (): boolean | null => stateOf('fullscreen'),
};

export { mainClusterControl };
