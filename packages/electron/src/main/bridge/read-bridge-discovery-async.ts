/* @layer electron-main @kind logic */
import type { BridgeDiscovery } from './bridge.type';
import { discoveryFromText } from './discovery-from-text';
import { readPrivateFileAsync } from './read-private-file-async';

const readBridgeDiscoveryAsync = async (file: string): Promise<BridgeDiscovery> => discoveryFromText(file, await readPrivateFileAsync(file));

export { readBridgeDiscoveryAsync };
