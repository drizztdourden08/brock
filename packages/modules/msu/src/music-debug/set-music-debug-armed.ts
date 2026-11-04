/* @layer core @kind logic */
import { musicDebugState } from './music-debug-state';

const setMusicDebugArmed = (on: boolean): void => {
  musicDebugState.armed = on;
  musicDebugState.host?.setSoundTrace?.(on);
};

export { setMusicDebugArmed };
