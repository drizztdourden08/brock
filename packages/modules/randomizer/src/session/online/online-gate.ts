/* @layer core @kind logic */
import { probeServer } from '../../archipelago';
import type { PendingBoot } from '../store/pending-boot.type';
import { onlineBlockedReason } from './online-blocked-reason';
import { onlineConnectionOf } from './online-connection-of';
import type { OnlineGateRequest } from './online-gate-request.type';
import { ONLINE_KIND } from './online-session.constants';
import { socketFactoryOf } from './socket-factory-of';

const onlineGate = async <P, A>({ ap, profileId, config, log }: OnlineGateRequest<P, A>): Promise<PendingBoot | null> => {
  const reason = onlineBlockedReason(ap, config);
  const connection = onlineConnectionOf(config);
  if (reason !== null || connection === null) {
    log(`[Boot] Online start blocked: ${reason ?? 'no server address'}`, 'warn');
    return null;
  }
  const probe = await probeServer({ url: connection.url, game: ap.name, ...socketFactoryOf(ap) });
  if (probe.ok) log(`[Boot] Gate passed: server answered at ${probe.url ?? connection.url}`);
  else log(`[Boot] Server check failed (${probe.reason}); starting anyway`, 'warn');
  return { profileId, mode: ONLINE_KIND, config };
};

export { onlineGate };
