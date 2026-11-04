/* @layer renderer-shell @kind logic */
import type { RandomizerLog } from '../../contract/randomizer-log.type';
import { pendingBoot } from '../store/pending-boot';
import { sessionFactories } from '../store/session-factories';
import { startSession } from '../store/start-session';

const startPendingBoot = (log: RandomizerLog): boolean => {
  const pending = pendingBoot.get();
  if (pending === null) return false;
  pendingBoot.clear();
  const allows = sessionFactories.get(pending.mode)?.allowsStart;
  if (allows !== undefined && !allows()) return false;
  log(`[Boot] Auto-starting ${pending.mode} session for this profile (seed ${pending.config.seed})`);
  void startSession(pending, log);
  return true;
};

export { startPendingBoot };
