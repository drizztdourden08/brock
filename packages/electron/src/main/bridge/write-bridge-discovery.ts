/* @layer electron-main @kind logic */
import type { BridgeDiscovery } from './bridge.type';
import { writePrivateFile } from './write-private-file';

const writeBridgeDiscovery = (file: string, discovery: BridgeDiscovery): void => {
  writePrivateFile(file, JSON.stringify(discovery));
};

export { writeBridgeDiscovery };
