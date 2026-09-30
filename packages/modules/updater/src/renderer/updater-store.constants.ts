/* @layer renderer-shell @kind constants */
import type { UpdaterData } from './updater-store.type';

const UPDATER_IDLE: UpdaterData = {
  status: 'idle',
  info: null,
  percent: 0,
  error: null,
  versions: [],
  prefs: { allowPrerelease: false },
  currentVersion: '',
  capabilities: { hasSource: false, canCheck: false, canInstall: false },
  dialogOpen: false,
};

export { UPDATER_IDLE };
