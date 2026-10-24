/* @layer electron-main @kind logic */
import type { BridgeClientOptions } from './bridge-client.type';
import { BRIDGE_FILE_ENV } from './bridge.constants';
import { bridgeDiscoveryFile } from './bridge-discovery-file';

const discoveryFileOf = ({ file, app, instance }: Pick<BridgeClientOptions, 'file' | 'app' | 'instance'>): string => {
  const chosen = file ?? process.env[BRIDGE_FILE_ENV];
  if (chosen) return chosen;
  if (!app) throw new Error(`connectBridge needs the app id, a file, or ${BRIDGE_FILE_ENV} in the environment.`);
  return bridgeDiscoveryFile(app, instance ?? null);
};

export { discoveryFileOf };
