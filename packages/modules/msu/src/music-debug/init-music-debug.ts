/* @layer core @kind logic */
import type { MsuHost } from '../config';
import { subscribeMsuDebug } from '../player/debug-bus';
import { musicDebugState } from './music-debug-state';
import { onMsuDebug } from './on-msu-debug';

const initMusicDebug = (host: MsuHost): void => {
  const state = musicDebugState;
  if (state.installed) return;
  state.installed = true;
  state.host = host;
  state.unsubscribers.push(subscribeMsuDebug(onMsuDebug));
  const stopCoreWatch = host.onCoreRunning?.(() => {
    if (state.armed) host.setSoundTrace?.(true);
  });
  if (stopCoreWatch) state.unsubscribers.push(stopCoreWatch);
};

export { initMusicDebug };
