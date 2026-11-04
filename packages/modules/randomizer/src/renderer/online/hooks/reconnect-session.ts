/* @layer renderer-shell @kind logic */
import type { RandomizerProfileConfig } from '../../../augment';
import { onlineConnectionOf, useSessionStore } from '../../../session';
import { ONLINE_MODE } from '../online-mode.constants';

const reconnectSession = (config: RandomizerProfileConfig): void => {
  const session = useSessionStore.getState().session;
  const connection = onlineConnectionOf(config);
  if (session?.kind !== ONLINE_MODE || connection === null) return;
  session.reconnect?.(connection);
};

export { reconnectSession };
