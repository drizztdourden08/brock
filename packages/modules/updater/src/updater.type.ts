/* @layer core @kind types */
interface ReleaseAsset {
  name: string;
  url: string;
  size: number;
  contentType: string;
}

interface ReleaseMeta {
  tag: string;
  name: string;
  url: string;
  publishedAt: string;
  prerelease: boolean;
  assets: ReleaseAsset[];
}

interface UpdateInfo {
  version: string;
  releaseNotes: string;
  releaseDate: string;
  release?: ReleaseMeta;
}

interface VersionOption extends UpdateInfo {
  size: number;
  downloadSize: number;
  prerelease: boolean;
  downgrade: boolean;
  installed: boolean;
}

interface UpdaterCapabilities {
  hasSource: boolean;
  canCheck: boolean;
  canInstall: boolean;
}

interface UpdaterPrefs {
  allowPrerelease: boolean;
}

interface DownloadProgress {
  percent: number;
}

type Unsubscribe = () => void;

interface UpdaterApi {
  capabilities: () => Promise<UpdaterCapabilities>;
  getVersion: () => Promise<string>;
  getAvailable: () => Promise<UpdateInfo | null>;
  check: () => Promise<UpdateInfo | null>;
  listVersions: () => Promise<VersionOption[]>;
  apply: (version: string | null) => Promise<void>;
  openReleasePage: (version: string | null) => Promise<void>;
  getPrefs: () => Promise<UpdaterPrefs>;
  setPrefs: (prefs: UpdaterPrefs) => Promise<void>;
  installSize: () => Promise<number | null>;
  onUpdateAvailable: (listener: (info: UpdateInfo) => void) => Unsubscribe;
  onUpToDate: (listener: () => void) => Unsubscribe;
  onDownloadProgress: (listener: (progress: DownloadProgress) => void) => Unsubscribe;
  onDownloadComplete: (listener: () => void) => Unsubscribe;
  onError: (listener: (message: string) => void) => Unsubscribe;
}

export type {
  ReleaseAsset, ReleaseMeta, UpdateInfo, VersionOption, UpdaterCapabilities, UpdaterPrefs, DownloadProgress, Unsubscribe, UpdaterApi,
};
