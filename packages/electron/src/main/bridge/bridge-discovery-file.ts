/* @layer electron-main @kind logic */
import { homedir } from 'os';
import { join } from 'path';
import type { DiscoveryHost } from './bridge.type';
import { bridgeFileName } from './bridge-file-name';

const appDataDir = ({ env, platform, home }: DiscoveryHost): string => {
  if (platform === 'win32') return env.APPDATA ?? join(home, 'AppData', 'Roaming');
  if (platform === 'darwin') return join(home, 'Library', 'Application Support');
  return env.XDG_CONFIG_HOME ?? join(home, '.config');
};

const currentHost = (): DiscoveryHost => ({ env: process.env, platform: process.platform, home: homedir() });

const bridgeDiscoveryFile = (app: string, key: string | null = null, host: DiscoveryHost = currentHost()): string =>
  join(appDataDir(host), app, bridgeFileName(key));

export { bridgeDiscoveryFile };
