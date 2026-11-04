/* @layer renderer-shell @kind logic */
import type { RandomizerGame } from '../../contract/randomizer-game.type';
import type { RandomizerLog } from '../../contract/randomizer-log.type';
import { createLocalSessionFactory } from '../local/local-session-factory';
import { appRandomizerLog } from '../log/app-randomizer-log';
import { createOnlineSessionFactory } from '../online/create-online-session-factory';
import { ONLINE_KIND } from '../online/online-session.constants';
import { registerSessionFactory } from '../store/register-session-factory';
import { sessionFactories } from '../store/session-factories';
import { stopActiveSession } from '../store/stop-active-session';
import { LIVE_CORE_STATUSES } from './core-live.constants';
import { runtimeStops } from './runtime-stops';
import { startPendingBoot } from './start-pending-boot';

const startSessionRuntime = <P, A>(game: RandomizerGame<P, A>, log: RandomizerLog = appRandomizerLog): (() => void) => {
  const existing = runtimeStops.get(game.id);
  if (existing !== undefined) return existing;
  if (!sessionFactories.has('local')) registerSessionFactory(createLocalSessionFactory(game, log));
  if (game.archipelago !== undefined && !sessionFactories.has(ONLINE_KIND)) {
    registerSessionFactory(createOnlineSessionFactory(game, log));
  }
  let wasLive = false;
  let startedForBoot = false;
  const unsubscribe = game.core.subscribe(() => {
    const live = LIVE_CORE_STATUSES.has(game.core.state().status);
    if (live && !wasLive) {
      wasLive = true;
      if (!startedForBoot) startedForBoot = startPendingBoot(log);
    } else if (!live && wasLive) {
      wasLive = false;
      startedForBoot = false;
      stopActiveSession();
    }
  });
  const stop = (): void => {
    unsubscribe();
    runtimeStops.delete(game.id);
  };
  runtimeStops.set(game.id, stop);
  return stop;
};

export { startSessionRuntime };
