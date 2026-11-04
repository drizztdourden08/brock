/* @layer renderer-shell @kind logic */
import type { RandomizerGame } from '../../contract/randomizer-game.type';
import type { RandomizerLog } from '../../contract/randomizer-log.type';
import { appRandomizerLog } from '../log/app-randomizer-log';
import { createLocalSession } from './create-local-session';
import { gateLocalPlacement } from './gate-local-placement';
import { LOCAL_KIND } from './local-session.constants';
import type { SessionFactory } from './session-factory.type';

const createLocalSessionFactory = <P, A>(
  game: RandomizerGame<P, A>,
  log: RandomizerLog = appRandomizerLog,
): SessionFactory => ({
  mode: LOCAL_KIND,
  placementBacked: true,
  gate: (profileId, config) => gateLocalPlacement(game, profileId, config, log),
  create: (pending) => createLocalSession({ game, placement: pending.placement as P, seed: pending.config.seed, log }),
});

export { createLocalSessionFactory };
