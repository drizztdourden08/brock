/* @layer core @kind types */
import type {
  DownloadProgress, UpdateInfo, UpdaterApi, UpdaterCapabilities, UpdaterPrefs, VersionOption,
} from './updater.type';

declare module '@drizztdourden08/brock-core/augment' {
  interface InvokeContract {
    'updater:capabilities': () => Promise<UpdaterCapabilities>;
    'updater:getVersion': () => Promise<string>;
    'updater:getAvailable': () => Promise<UpdateInfo | null>;
    'updater:check': () => Promise<UpdateInfo | null>;
    'updater:listVersions': () => Promise<VersionOption[]>;
    'updater:apply': (version: string | null) => Promise<void>;
    'updater:openReleasePage': (version: string | null) => Promise<void>;
    'updater:getPrefs': () => Promise<UpdaterPrefs>;
    'updater:setPrefs': (prefs: UpdaterPrefs) => Promise<void>;
  }

  interface EventContract {
    'updater:updateAvailable': (info: UpdateInfo) => void;
    'updater:upToDate': () => void;
    'updater:downloadProgress': (progress: DownloadProgress) => void;
    'updater:downloadComplete': () => void;
    'updater:error': (message: string) => void;
  }

  interface IpcNamespaces {
    updater: UpdaterApi;
  }
}
