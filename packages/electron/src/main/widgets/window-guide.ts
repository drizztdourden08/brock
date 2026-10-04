/* @layer electron-main @kind logic */
import type { WindowGuideMode, WindowGuideState } from '@drizztdourden08/brock-core';
import { emit } from '../ipc/emit';
import { anyWindow } from './any-window';
import { modifierState } from './modifier-state';
import { widgetWindowEntries } from './widget-window-entries';
import { CLOSED_GUIDE, GUIDE_IDLE_MS } from './widget-windows.constants';

let state: WindowGuideState = CLOSED_GUIDE;
let holder: string | null = null;
let timer: ReturnType<typeof setTimeout> | null = null;

const snappingFor = (id: string, mode: WindowGuideMode): boolean => {
  const own = widgetWindowEntries.get(id)?.snap ?? true;
  return mode === 'moving' ? own : own && !modifierState.ctrl;
};

const tell = (id: string, next: WindowGuideState): void => {
  const win = anyWindow(id);
  if (win) emit(win, 'widget:guide', next);
};

const send = (id: string, next: WindowGuideState): void => {
  if (holder !== null && holder !== id && state.open) tell(holder, { ...state, open: false });
  const same = holder === id && next.open === state.open && next.mode === state.mode && next.snapping === state.snapping;
  holder = id;
  state = next;
  if (!same) tell(id, next);
};

const clearIdle = (): void => {
  if (timer) clearTimeout(timer);
  timer = null;
};

const end = (id: string): void => {
  if (holder !== id) return;
  clearIdle();
  send(id, { ...state, open: false });
};

const touch = (id: string, mode: WindowGuideMode): void => {
  send(id, { open: true, mode, snapping: snappingFor(id, mode) });
  if (process.platform !== 'linux') return;
  clearIdle();
  timer = setTimeout(() => end(id), GUIDE_IDLE_MS);
};

const refresh = (): void => {
  if (holder !== null && state.open) send(holder, { ...state, snapping: snappingFor(holder, state.mode) });
};

const windowGuide = { touch, end, refresh, current: (): WindowGuideState => state, holder: (): string | null => (state.open ? holder : null) };

export { windowGuide };
