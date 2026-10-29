/* @layer electron-main @kind logic */
import type { AppLaunch, ReadAppLaunchOptions } from './app-launch.type';
import { bridgeLaunchFile } from './bridge-launch-file';
import { discoveryFileOf } from './discovery-file-of';
import { launchFromText } from './launch-from-text';
import { readPrivateFileAsync } from './read-private-file-async';

const readAppLaunchAsync = async ({ background = false, ...where }: ReadAppLaunchOptions): Promise<AppLaunch> => {
  const file = bridgeLaunchFile(discoveryFileOf(where));
  return launchFromText(file, await readPrivateFileAsync(file), background);
};

export { readAppLaunchAsync };
