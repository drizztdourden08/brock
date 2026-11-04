/* @layer core @kind logic */
import { createLocationPoller } from '../poller/create-location-poller';
import { createMemoryApStateStore } from '../received/memory-ap-state-store';
import { createReceivedQueue } from '../received/received-queue';
import { checkSignal } from '../signal/check-signal';
import { createOnlineRun } from './create-online-run';
import type { OnlineLate, OnlineParts } from './online-parts.type';
import type { OnlineSessionOptions } from './online-session-options.type';
import { reportOnlineCheck } from './report-online-check';

const createOnlineParts = <P, A>(options: OnlineSessionOptions<P, A>, late: OnlineLate): OnlineParts<P, A> => {
  const { game, ap, connection, log } = options;
  const store = game.apState ?? createMemoryApStateStore();
  const parts: OnlineParts<P, A> = {
    game,
    ap,
    log,
    run: createOnlineRun<A>(),
    poller: createLocationPoller({
      memory: game.memory,
      ...game.poll,
      afterPoll: (view) => checkSignal.notify(view),
      log,
    }),
    store,
    received: createReceivedQueue({ store, roomHash: () => store.read()?.roomHash ?? '' }),
    link: { connection },
    late,
    report: (key) => reportOnlineCheck(parts, key),
  };
  return parts;
};

export { createOnlineParts };
