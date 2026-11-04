/* @layer renderer-shell @kind logic */
import type { RandomizerGame } from '../../contract/randomizer-game.type';
import type { RandomizerLog } from '../../contract/randomizer-log.type';
import type { SessionFactory } from '../local/session-factory.type';
import { appRandomizerLog } from '../log/app-randomizer-log';
import { createOnlineSession } from './create-online-session';
import { onlineBlockedReason } from './online-blocked-reason';
import { onlineConnectionOf } from './online-connection-of';
import { onlineGate } from './online-gate';
import { NO_ARCHIPELAGO, ONLINE_KIND } from './online-session.constants';

const createOnlineSessionFactory = <P, A>(
  game: RandomizerGame<P, A>,
  log: RandomizerLog = appRandomizerLog,
): SessionFactory => ({
  mode: ONLINE_KIND,
  placementBacked: true,
  gate: (profileId, config) =>
    game.archipelago === undefined
      ? Promise.resolve(null)
      : onlineGate({ ap: game.archipelago, profileId, config, log }),
  create: (pending) => {
    if (game.archipelago === undefined) throw new Error(NO_ARCHIPELAGO);
    return createOnlineSession({
      game,
      ap: game.archipelago,
      connection: onlineConnectionOf(pending.config),
      source: pending.profileId === '' ? 'manual' : 'profile',
      log,
    });
  },
  blockedReason: (config) =>
    game.archipelago === undefined ? NO_ARCHIPELAGO : onlineBlockedReason(game.archipelago, config),
});

export { createOnlineSessionFactory };
