/* @layer core @kind logic */
import { musicDebugState } from './music-debug-state';
import { notifyMusicDebug } from './notify-music-debug';

const disposeMusicDebug = (): void => {
  const state = musicDebugState;
  state.unsubscribers.forEach((stop) => stop());
  state.unsubscribers = [];
  if (state.armed) state.host?.setSoundTrace?.(false);
  state.armed = false;
  state.installed = false;
  state.host = null;
  state.events = [];
  state.counters.clear();
  state.countersSnapshot = [];
  state.countersDirtyAt = -1;
  notifyMusicDebug();
};

export { disposeMusicDebug };
