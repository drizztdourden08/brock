/* @layer electron-main @kind logic */
import { basename, dirname, join } from 'path';
import { BRIDGE_LAUNCH_PREFIX } from './bridge.constants';

const bridgeLaunchFile = (discoveryFile: string): string => join(dirname(discoveryFile), `${BRIDGE_LAUNCH_PREFIX}${basename(discoveryFile)}`);

export { bridgeLaunchFile };
