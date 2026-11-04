/* @layer core @kind logic */
import { normalizeServerUrl } from '../../archipelago';
import type { OnlineConnection } from '../../archipelago';
import type { RandomizerProfileConfig } from '../../augment';

const onlineConnectionOf = (config: RandomizerProfileConfig): OnlineConnection | null => {
  const url = normalizeServerUrl(config.serverUrl ?? '');
  if (url === '') return null;
  const connection: OnlineConnection = {
    url,
    slotName: config.slotName ?? '',
    deathLink: config.deathLink === true,
    trackOtherPlayers: config.trackOtherPlayers !== false,
  };
  const fallback = normalizeServerUrl(config.fallbackServerUrl ?? '');
  if (fallback !== '') connection.fallbackUrl = fallback;
  if (config.password) connection.password = config.password;
  return connection;
};

export { onlineConnectionOf };
