/* @layer electron-main @kind logic */
import { activeGroup } from './active-group';
import { groupLayout } from './group-layout';
import { groupOf } from './group-of';
import { groupVisibility } from './group-visibility';
import { MAIN_ANCHOR } from './widget-windows.constants';
import type { GroupMode } from './widget-windows.type';

const laidOut = (): GroupMode => groupLayout.modeOf(groupOf(MAIN_ANCHOR));

const maximize = (): boolean => {
  const group = groupOf(MAIN_ANCHOR);
  if (group !== null && laidOut() !== 'normal') return groupLayout.toggle(group, 'maximized');
  const active = activeGroup(MAIN_ANCHOR);
  return active !== null && groupLayout.enter(active, 'maximized');
};

const fullscreen = (on?: boolean): boolean => {
  const group = groupOf(MAIN_ANCHOR);
  const mode = laidOut();
  const wanted = on ?? mode !== 'fullscreen';
  if (group !== null && !wanted) return mode === 'fullscreen' && groupLayout.restore(group);
  if (mode === 'fullscreen') return true;
  const active = activeGroup(MAIN_ANCHOR);
  return active !== null && groupLayout.enter(active, 'fullscreen');
};

const minimize = (): boolean => {
  const active = activeGroup(MAIN_ANCHOR);
  if (active === null) return false;
  groupVisibility.minimize(active);
  return true;
};

const stateOf = (mode: GroupMode): boolean | null => (laidOut() === 'normal' ? null : laidOut() === mode);

const mainGroupControl = {
  maximize, fullscreen, minimize, isMaximized: (): boolean | null => stateOf('maximized'), isFullscreen: (): boolean | null => stateOf('fullscreen'),
};

export { mainGroupControl };
