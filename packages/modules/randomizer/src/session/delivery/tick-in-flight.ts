/* @layer core @kind logic */
import { DELIVERY_TIMEOUT_FRAMES } from './delivery.constants';
import type { DeliveryEntry } from './delivery-entry.type';
import { fireComplete } from './fire-complete';
import { releaseInFlight } from './release-in-flight';
import type { TickContext } from './tick-context.type';

const tickInFlight = <A>(ctx: TickContext<A>, delivering: DeliveryEntry<A>): void => {
  const { state, deliverer, log } = ctx;
  delivering.waitedFrames++;
  const ready = deliverer.isSafeFrame();
  if (!ready) state.becameBusy = true;
  if (ready && state.becameBusy) {
    fireComplete(releaseInFlight(state, delivering));
    return;
  }
  if (delivering.waitedFrames < DELIVERY_TIMEOUT_FRAMES) return;
  if (deliverer.holdsInFlight?.(delivering.request.action)) {
    log(`Delivery "${delivering.request.message}" still waiting for its pickup to finish, keeping it in flight`, 'warn');
    delivering.waitedFrames = 0;
    return;
  }
  const done = releaseInFlight(state, delivering);
  log(`Delivery "${done.request.message}" timed out waiting for pickup to finish`, 'warn');
  fireComplete(done);
};

export { tickInFlight };
