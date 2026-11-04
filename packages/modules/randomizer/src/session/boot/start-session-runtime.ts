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
import { startPendingBoot } from './start-pending-boot';

const startSessionRuntime = <P, A>(game: RandomizerGame<P, A>, log: RandomizerLog = appRandomizerLog): (() => void) => {
  if (!sessionFactories.has('local')) registerSessionFactory(createLocalSessionFactory(game, log));
  if (game.archipelago !== undefined && !sessionFactories.has(ONLINE_KIND)) {
    registerSessionFactory(createOnlineSessionFactory(game, log));
  }
  let wasRunning = false;
  let startedForBoot = false;
  return game.core.subscribe(() => {
    const running = game.core.state().status === 'running';
    if (running && !wasRunning) {
      wasRunning = true;
      if (!startedForBoot) startedForBoot = startPendingBoot(log);
    } else if (!running && wasRunning) {
      wasRunning = false;
      startedForBoot = false;
      stopActiveSession();
    }
  });
};

export { startSessionRuntime };
