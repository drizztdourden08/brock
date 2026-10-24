/* @layer electron-main @kind logic */
import type { AppLaunch } from './app-launch.type';
import { bridgeLaunchFile } from './bridge-launch-file';
import { writePrivateFile } from './write-private-file';

const writeAppLaunch = (discoveryFile: string, launch: AppLaunch): string => {
  const file = bridgeLaunchFile(discoveryFile);
  writePrivateFile(file, JSON.stringify(launch));
  return file;
};

export { writeAppLaunch };
