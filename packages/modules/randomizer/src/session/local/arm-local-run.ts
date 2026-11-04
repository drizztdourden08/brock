/* @layer core @kind logic */
import { createDeliveryQueue } from '../delivery/create-delivery-queue';
import { createRafFrameClock } from '../delivery/raf-frame-clock';
import { createLocationPoller } from '../poller/create-location-poller';
import { adoptNextFrame } from './adopt-next-frame';
import { LOCAL_TAG } from './local-session.constants';
import type { LocalRun } from './local-run.type';
import type { LocalSessionOptions } from './local-session-options.type';
import type { RandomizerSession } from './randomizer-session.type';
import { revertApplier } from './revert-applier';

const armLocalRun = async <P, A>(
  options: LocalSessionOptions<P, A>,
  session: RandomizerSession,
): Promise<LocalRun<A> | null> => {
  const { game, placement, log } = options;
  const poller = createLocationPoller({ memory: game.memory, ...game.poll, log });
  const clock = game.frames ?? createRafFrameClock();
  const queue = game.deliverer ? createDeliveryQueue<A>({ deliverer: game.deliverer, clock, log }) : null;
  const result = await game.applier.apply(placement, {
    tag: LOCAL_TAG,
    reportCheck: session.reportCheck,
    suppress: poller.suppress,
    log,
  });
  if (!result.ok) {
    log(`${LOCAL_TAG} Session start refused: ${result.refusal}`, 'error');
    await revertApplier(game, log);
    return null;
  }
  queue?.start();
  poller.start(result.armed.polled ?? [], { report: session.reportCheck });
  return { armed: result.armed, poller, queue, stopAdopt: adoptNextFrame(clock, poller) };
};

export { armLocalRun };
