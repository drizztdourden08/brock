/* @layer core @kind logic */
import { withdrawSoundClaims } from '../msu-sound-claims';
import { clearPoll } from './clear-poll';
import { msuSessionState } from './msu-session-state';

const stopMsuSession = (): void => {
  const state = msuSessionState;
  clearPoll();
  state.pending = null;
  state.owner = null;
  if (!state.engine) return;
  const teardown = state.teardown;
  state.engine.dispose();
  state.engine = null;
  state.teardown = null;
  if (!teardown) return;
  teardown.host.restoreCoreMusic();
  teardown.host.setExternalMusic(false);
  teardown.host.setVariant?.(null);
  withdrawSoundClaims(teardown.host, teardown.config);
};

export { stopMsuSession };
