/* @layer core @kind logic */
import { AUDIO_CONTEXT_POLL_MS, clearPoll, msuSessionState, stopMsuSession } from '../msu-session';
import type { MsuSessionOptions } from '../msu-session';
import { attachEngine } from './attach-engine';
import { createSessionApi } from './create-session-api';
import type { EngineHolder, MsuSession } from './session.type';

const retryPendingAttach = (): void => {
  const { pending } = msuSessionState;
  if (!pending) {
    clearPoll();
    return;
  }
  if (!pending()) return;
  msuSessionState.pending = null;
  clearPoll();
};

const startMsuSession = <Ctx = unknown>(options: MsuSessionOptions<Ctx>): MsuSession<Ctx> => {
  stopMsuSession();
  const holder: EngineHolder<Ctx> = { engine: null };
  msuSessionState.owner = holder;
  const session = createSessionApi(options, holder);
  if (attachEngine(options, holder)) return session;
  msuSessionState.pending = () => attachEngine(options, holder);
  clearPoll();
  msuSessionState.pollId = setInterval(retryPendingAttach, AUDIO_CONTEXT_POLL_MS);
  return session;
};

export { startMsuSession };
