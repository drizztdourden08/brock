/* @layer renderer-shell @kind logic */
import type { ArchipelagoSession } from '../../archipelago';
import type { SessionStatus } from '../local/randomizer-session.type';
import { useSessionStore } from '../store/behavior/useSessionStore';
import { createOnlineClient } from './create-online-client';
import { createOnlineHost } from './create-online-host';
import { createOnlineParts } from './create-online-parts';
import { disarmOnlineRun } from './disarm-online-run';
import { onlineEventHandler } from './online-event-handler';
import { NO_SERVER, ONLINE_KIND, ONLINE_TAG } from './online-session.constants';
import type { OnlineParts } from './online-parts.type';
import type { OnlineSessionOptions } from './online-session-options.type';
import type { OnlineSession } from './online-session.type';
import { reportedOnline } from './reported-online';

const createOnlineSession = <P, A>(options: OnlineSessionOptions<P, A>): OnlineSession => {
  const { source, log } = options;
  let status: SessionStatus = 'idle';
  let offEvents: (() => void) | null = null;
  const isCurrent = (): boolean => useSessionStore.getState().session === session;
  const setStatus = (next: SessionStatus): void => {
    status = next;
    if (isCurrent()) useSessionStore.getState().setStatus(next);
  };
  const parts: OnlineParts<P, A> = createOnlineParts(options, {
    client: () => client,
    publishPlacement: (placement) => {
      if (isCurrent()) useSessionStore.getState().setPlacement(placement);
    },
    refuse: () => {
      client.close();
      setStatus('error');
    },
  });
  const client: ArchipelagoSession = createOnlineClient(parts, createOnlineHost(parts));
  const onEvent = onlineEventHandler(client, setStatus);

  const session: OnlineSession = {
    kind: ONLINE_KIND,
    get status() {
      return status;
    },
    client,
    reportCheck: parts.report,
    reported: () => reportedOnline(parts),
    start: () => {
      const { connection } = parts.link;
      if (connection === null) {
        setStatus('error');
        return Promise.reject(new Error(NO_SERVER));
      }
      status = 'starting';
      offEvents = client.onEvent(onEvent);
      client.connect(connection);
      return Promise.resolve();
    },
    stop: () => {
      client.close();
      disarmOnlineRun(parts);
      offEvents?.();
      offEvents = null;
      status = 'idle';
    },
    reconnect: (next) => {
      if (source !== 'profile') return;
      log(`${ONLINE_TAG} Connection edited: reconnecting to ${next.url} as ${next.slotName}`);
      parts.link.connection = next;
      setStatus('starting');
      client.connect(next);
    },
  };
  return session;
};

export { createOnlineSession };
