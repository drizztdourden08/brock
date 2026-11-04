/* @layer core @kind logic */
import { DELIVERY_COOLDOWN_FRAMES, REFUSAL_RETRY_FRAMES, REFUSAL_WARN_EVERY } from './delivery.constants';
import { fireComplete } from './fire-complete';
import { fireGranted } from './fire-granted';
import type { TickContext } from './tick-context.type';

const tickFrontEntry = <A>(ctx: TickContext<A>): void => {
  const { state, deliverer, log } = ctx;
  const entry = state.queue[0];
  if (entry === undefined) return;
  if (!deliverer.isSafeFrame()) return;

  const outcome = deliverer.execute(entry.request.action);
  if (outcome === 'refused') {
    entry.refusals += 1;
    if (entry.refusals % REFUSAL_WARN_EVERY === 0) {
      log(`Delivery "${entry.request.message}" refused ${entry.refusals} times, retrying until the player can receive`, 'warn');
    }
    state.cooldownFrames = REFUSAL_RETRY_FRAMES;
    return;
  }
  fireGranted(entry);
  state.queue.shift();
  if (outcome === 'settled') {
    state.cooldownFrames = DELIVERY_COOLDOWN_FRAMES;
    fireComplete(entry);
    return;
  }
  state.delivering = entry;
  state.becameBusy = false;
  entry.waitedFrames = 0;
};

export { tickFrontEntry };
