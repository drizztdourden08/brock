/* @layer electron-main @kind logic */
import type { WindowGuideMode, WindowGuideState } from '@drizztdourden08/brock-core';
import { emit } from '../ipc/emit';
import { getMainWindow } from '../window/get-main-window';
import { modifierState } from './modifier-state';
import { GUIDE_IDLE_MS } from './widget-windows.constants';

let state: WindowGuideState = { open: false, mode: 'moving', snapping: true };
let timer: ReturnType<typeof setTimeout> | null = null;

const send = (next: WindowGuideState): void => {
  if (next.open === state.open && next.mode === state.mode && next.snapping === state.snapping) return;
  state = next;
  const main = getMainWindow();
  if (main && !main.isDestroyed()) emit(main, 'widget:guide', state);
};

const clearIdle = (): void => {
  if (timer) clearTimeout(timer);
  timer = null;
};

const end = (): void => {
  clearIdle();
  send({ ...state, open: false });
};

const touch = (mode: WindowGuideMode): void => {
  send({ open: true, mode, snapping: !modifierState.ctrl });
  if (process.platform !== 'linux') return;
  clearIdle();
  timer = setTimeout(end, GUIDE_IDLE_MS);
};

const refresh = (): void => {
  if (state.open) send({ ...state, snapping: !modifierState.ctrl });
};

const windowGuide = { touch, end, refresh, current: (): WindowGuideState => state };

export { windowGuide };
