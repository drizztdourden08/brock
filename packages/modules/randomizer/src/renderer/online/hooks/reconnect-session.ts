/* @layer renderer-shell @kind logic */
import type { RandomizerProfileConfig } from '../../../augment';
import { useSessionStore } from '../../../session';
import { ONLINE_MODE } from '../online-mode.constants';
import { connectionOfConfig } from './connection-of-config';
import type { OnlineSessionView } from './online-session.type';

const reconnectSession = (config: RandomizerProfileConfig): void => {
  const session = useSessionStore.getState().session as OnlineSessionView | null;
  const connection = connectionOfConfig(config);
  if (session?.kind !== ONLINE_MODE || connection === null) return;
  session.reconnect?.(connection);
};

export { reconnectSession };
