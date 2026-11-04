/* @layer renderer-shell @kind logic */
import type { RandomizerLog } from '../../contract/randomizer-log.type';
import { appRandomizerLog } from '../log/app-randomizer-log';
import { sessionFactories } from './session-factories';
import type { PendingBoot } from './pending-boot.type';
import { useSessionStore } from './session-store';
import { stopActiveSession } from './stop-active-session';

const startSession = async (pending: PendingBoot, log: RandomizerLog = appRandomizerLog): Promise<void> => {
  const factory = sessionFactories.get(pending.mode);
  if (factory === undefined) {
    log(`[Boot] No session factory is registered for mode ${pending.mode}`, 'error');
    return;
  }
  stopActiveSession();
  const session = factory.create(pending);
  const { setSession, setStatus } = useSessionStore.getState();
  setSession(session, pending.placement ?? null);
  setStatus('starting');
  let failed = false;
  try {
    await session.start();
  } catch (error) {
    failed = true;
    log(`[Boot] Session start failed: ${error instanceof Error ? error.message : String(error)}`, 'error');
  }
  if (useSessionStore.getState().session === session) setStatus(failed ? 'error' : session.status);
};

export { startSession };
