/* @layer mcp-helper @kind logic */
import { readBridgeDiscovery } from '@drizztdourden08/brock-electron/bridge';

const isBridgeRunning = (file: string): boolean => {
  try {
    readBridgeDiscovery(file);
    return true;
  } catch {
    return false;
  }
};

export { isBridgeRunning };
