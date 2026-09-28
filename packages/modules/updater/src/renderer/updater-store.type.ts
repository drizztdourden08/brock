/* @layer renderer-shell @kind types */
import type { UpdateInfo, UpdaterCapabilities, UpdaterPrefs, VersionOption } from '../updater.type';

type UpdateStatus = 'idle' | 'checking' | 'available' | 'downloading' | 'ready' | 'error';

interface UpdaterData {
  status: UpdateStatus;
  info: UpdateInfo | null;
  percent: number;
  error: string | null;
  versions: VersionOption[];
  prefs: UpdaterPrefs;
  currentVersion: string;
  capabilities: UpdaterCapabilities;
  dialogOpen: boolean;
}

interface UpdaterActions {
  connect: () => () => void;
  check: () => Promise<void>;
  loadVersions: () => Promise<void>;
  setPrefs: (prefs: UpdaterPrefs) => Promise<void>;
  apply: (version: string | null) => Promise<void>;
  openReleasePage: (version: string | null) => Promise<void>;
  openDialog: () => void;
  closeDialog: () => void;
  checkAndOpen: () => void;
}

type UpdaterStoreState = UpdaterData & UpdaterActions;

type SetUpdater = (patch: Partial<UpdaterData>) => void;

export type { UpdateStatus, UpdaterData, UpdaterActions, UpdaterStoreState, SetUpdater };
