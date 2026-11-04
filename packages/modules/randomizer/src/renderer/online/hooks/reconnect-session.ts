/* @layer renderer-shell @kind logic */
import type { RandomizerProfileConfig } from '../../../augment';
import { onlineConnectionOf, useSessionStore } from '../../../session';
import { ONLINE_MODE } from '../online-mode.constants';
import type { OnlineSessionView } from './online-session.type';

const reconnectSession = (config: RandomizerProfileConfig): void => {
  const session: OnlineSessionView | null = useSessionStore.getState().session;
  const connection = onlineConnectionOf(config);
  if (session?.kind !== ONLINE_MODE || connection === null) return;
  session.reconnect?.(connection);
};

export { reconnectSession };
