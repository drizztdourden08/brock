/* @layer core @kind logic */
import type { PollerOptions } from './location-poller.type';
import type { PollerState } from './poller-state.type';
import { runPollPass } from './run-poll-pass';

const ignorePollFailure = (): void => undefined;

const pollOnce = (state: PollerState, options: PollerOptions): void => {
  const { hooks } = state;
  if (hooks === null) return;
  try {
    runPollPass(state, hooks, options);
  } catch {
    ignorePollFailure();
  }
};

export { pollOnce };
