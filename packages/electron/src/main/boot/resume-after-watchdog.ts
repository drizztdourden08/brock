/* @layer electron-main @kind logic */
import { note } from '../crash-forensics/note';
import { bootState } from './boot-state';
import { relayProgress } from './relay-progress';

const resumeAfterWatchdog = (): boolean => {
  if (!bootState.failure?.watchdog) return false;
  bootState.failure = null;
  note('info', 'boot resumed: the interface answered after the watchdog fired');
  relayProgress();
  return true;
};

export { resumeAfterWatchdog };
