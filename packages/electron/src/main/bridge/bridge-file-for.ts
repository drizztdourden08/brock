/* @layer electron-main @kind logic */
import type { BridgeFileForOptions } from './bridge-file-for.type';
import { bridgeDiscoveryFile } from './bridge-discovery-file';
import { bridgeKeyOf } from './bridge-key';

const bridgeFileFor = ({ app, userData = null, instance = null }: BridgeFileForOptions): string =>
  bridgeDiscoveryFile(app, bridgeKeyOf(instance, userData));

export { bridgeFileFor };
