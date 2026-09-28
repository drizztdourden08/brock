/* @layer electron-main @kind logic */
import type { MainContext } from '@drizztdourden08/brock-electron/main';
import type { UpdaterMain } from './updater-main.type';

const registerUpdaterHandlers = ({ handle }: Pick<MainContext, 'handle'>, updater: UpdaterMain): void => {
  handle('updater:capabilities', () => updater.capabilities());
  handle('updater:getVersion', () => updater.currentVersion());
  handle('updater:getAvailable', () => updater.available());
  handle('updater:check', () => updater.check());
  handle('updater:listVersions', () => updater.listVersions());
  handle('updater:apply', (_event, version) => updater.apply(version));
  handle('updater:openReleasePage', (_event, version) => updater.openReleasePage(version));
  handle('updater:getPrefs', () => updater.getPrefs());
  handle('updater:setPrefs', (_event, prefs) => updater.setPrefs(prefs));
};

export { registerUpdaterHandlers };
