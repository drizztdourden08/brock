/* @layer electron-main @kind logic */
import { SPLASH_CHANNELS } from '../../splash-preload/splash-channels.constants';
import { bootState } from './boot-state';
import { relayProgress } from './relay-progress';
import { sendToSplash } from './send-to-splash';

const replaySplash = (): void => {
  relayProgress();
  const { failure } = bootState;
  if (failure) sendToSplash(SPLASH_CHANNELS.failure, { label: failure.label, message: failure.message, timedOut: failure.timedOut });
};

export { replaySplash };
