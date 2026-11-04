/* @layer renderer-shell @kind logic */
import type { OnlineConnection } from '../../../archipelago';
import { normalizeServerUrl } from '../../../archipelago';
import type { RandomizerProfileConfig } from '../../../augment';

const connectionOfConfig = (config: RandomizerProfileConfig): OnlineConnection | null => {
  const url = normalizeServerUrl(config.serverUrl ?? '');
  if (url === '') return null;
  const connection: OnlineConnection = {
    url,
    slotName: config.slotName ?? '',
    deathLink: config.deathLink ?? false,
    trackOtherPlayers: config.trackOtherPlayers ?? false,
  };
  if (config.fallbackServerUrl) connection.fallbackUrl = config.fallbackServerUrl;
  if (config.password) connection.password = config.password;
  return connection;
};

export { connectionOfConfig };
