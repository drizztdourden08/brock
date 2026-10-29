/* @layer electron-main @kind logic */
import type { AppLaunch, ReadAppLaunchOptions } from './app-launch.type';
import { bridgeLaunchFile } from './bridge-launch-file';
import { discoveryFileOf } from './discovery-file-of';
import { launchFromText } from './launch-from-text';
import { readPrivateFile } from './read-private-file';

const readAppLaunch = ({ background = false, ...where }: ReadAppLaunchOptions): AppLaunch => {
  const file = bridgeLaunchFile(discoveryFileOf(where));
  return launchFromText(file, readPrivateFile(file), background);
};

export { readAppLaunch };
