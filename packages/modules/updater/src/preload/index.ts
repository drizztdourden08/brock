/* @layer electron-preload @kind barrel */
import '../augment';
import type { PreloadNamespace, BridgeTools } from '@drizztdourden08/brock-electron/preload';
import type { UpdaterApi } from '../updater.type';

const buildUpdaterApi = ({ invoke, subscribe }: BridgeTools): UpdaterApi => ({
  capabilities: () => invoke('updater:capabilities'),
  getVersion: () => invoke('updater:getVersion'),
  getAvailable: () => invoke('updater:getAvailable'),
  check: () => invoke('updater:check'),
  listVersions: () => invoke('updater:listVersions'),
  apply: (version) => invoke('updater:apply', version),
  openReleasePage: (version) => invoke('updater:openReleasePage', version),
  getPrefs: () => invoke('updater:getPrefs'),
  setPrefs: (prefs) => invoke('updater:setPrefs', prefs),
  onUpdateAvailable: (listener) => subscribe('updater:updateAvailable', listener),
  onUpToDate: (listener) => subscribe('updater:upToDate', listener),
  onDownloadProgress: (listener) => subscribe('updater:downloadProgress', listener),
  onDownloadComplete: (listener) => subscribe('updater:downloadComplete', listener),
  onError: (listener) => subscribe('updater:error', listener),
});

const updaterPreload: PreloadNamespace = {
  id: 'updater',
  build: buildUpdaterApi,
};

export default updaterPreload;
export { updaterPreload, buildUpdaterApi };
export type { UpdaterApi, UpdateInfo, VersionOption, UpdaterPrefs } from '../updater.type';
