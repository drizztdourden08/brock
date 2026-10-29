/* @layer electron-main @kind logic */
import type { BridgeDiscovery } from './bridge.type';
import { discoveryFromText } from './discovery-from-text';
import { readPrivateFile } from './read-private-file';

const readBridgeDiscovery = (file: string): BridgeDiscovery => discoveryFromText(file, readPrivateFile(file));

export { readBridgeDiscovery };
