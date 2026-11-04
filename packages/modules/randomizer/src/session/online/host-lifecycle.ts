/* @layer core @kind logic */
import type { OnlineHost } from '../../archipelago';
import { disarmOnlineRun } from './disarm-online-run';
import type { OnlineParts } from './online-parts.type';
import { signalDeliveryReady } from './signal-delivery-ready';

const hostLifecycle = <P, A>(parts: OnlineParts<P, A>): Pick<OnlineHost, 'arm' | 'disarm'> => ({
  arm() {
    const { run, game, ap, link } = parts;
    run.live = true;
    run.generation += 1;
    run.stopCore?.();
    run.stopCore = game.core.subscribe(() => signalDeliveryReady(parts));
    if (link.connection !== null) ap.arm?.(link.connection);
  },
  disarm: () => disarmOnlineRun(parts),
});

export { hostLifecycle };
