/* @layer electron-main @kind logic */
import { note } from '../crash-forensics/note';
import { SPLASH_CHANNELS } from '../../splash-preload/splash-channels.constants';
import type { BootFailureRecord } from './boot-state.type';
import { bootEvents } from './boot-events';
import { bootState } from './boot-state';
import { sendToSplash } from './send-to-splash';

const reportBootFailure = (failure: BootFailureRecord): void => {
  if (bootState.failure || bootState.revealing || bootState.revealed) return;
  bootState.failure = failure;
  if (bootState.watchdog) clearTimeout(bootState.watchdog);
  bootState.watchdog = null;
  const line = `boot stopped at ${failure.side} task "${failure.task}" (${failure.label}): ${failure.message}`;
  note('error', line);
  sendToSplash(SPLASH_CHANNELS.failure, { label: failure.label, message: failure.message, timedOut: failure.timedOut });
  bootEvents.emit('failed', failure);
};

export { reportBootFailure };
