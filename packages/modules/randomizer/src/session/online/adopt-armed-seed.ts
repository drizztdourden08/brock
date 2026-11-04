/* @layer core @kind logic */
import { createDeliveryQueue } from '../delivery/create-delivery-queue';
import { createRafFrameClock } from '../delivery/raf-frame-clock';
import type { ArmedSeed } from '../applier/armed-seed.type';
import { armedSummary } from '../local/armed-summary';
import { beginPolling } from './begin-polling';
import { flushCollected } from './flush-collected';
import { ONLINE_TAG } from './online-session.constants';
import type { OnlineParts } from './online-parts.type';
import { signalDeliveryReady } from './signal-delivery-ready';

const adoptArmedSeed = <P, A>(parts: OnlineParts<P, A>, armed: ArmedSeed<A>): void => {
  const { ap, game, run, log, late } = parts;
  run.armed = armed;
  for (const key of armed.serverGrants ?? []) {
    const id = ap.locationIdOf(key);
    if (id !== null) run.grants.add(id);
  }
  run.queue = game.deliverer
    ? createDeliveryQueue<A>({ deliverer: game.deliverer, clock: game.frames ?? createRafFrameClock(), log })
    : null;
  run.queue?.start();
  flushCollected(parts);
  late.publishPlacement(run.placement);
  log(`${ONLINE_TAG} Session armed: ${armedSummary(armed.counts)}`);
  if (run.pollWanted) beginPolling(parts);
  signalDeliveryReady(parts);
};

export { adoptArmedSeed };
