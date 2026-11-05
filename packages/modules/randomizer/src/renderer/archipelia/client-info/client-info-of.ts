/* @layer renderer-shell @kind logic */
import { requireHostApi } from '@drizztdourden08/brock-react';
import { createLobbyClientInfo, lobbyPlatformOf } from '../../../archipelago/lobby';
import type { LobbyClientInfo } from '../../../archipelago/lobby';
import { archipeliaOf } from '../game/archipelia-of';

const nodePlatformOf = (agent: string): string => {
  if (/android/i.test(agent)) return 'android';
  if (/windows/i.test(agent)) return 'win32';
  if (/mac os/i.test(agent)) return 'darwin';
  return /linux/i.test(agent) ? 'linux' : 'other';
};

const nodeArchOf = (agent: string): string => (/arm64|aarch64/i.test(agent) ? 'arm64' : 'x64');

const clientInfoOf = async (): Promise<LobbyClientInfo> => {
  const version = await requireHostApi().getAppVersion();
  const agent = globalThis.navigator.userAgent;
  const platform = lobbyPlatformOf(nodePlatformOf(agent), nodeArchOf(agent));
  return createLobbyClientInfo(archipeliaOf().archipelia.client, { version, platform });
};

export { clientInfoOf };
