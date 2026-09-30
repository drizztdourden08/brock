/* @layer renderer-shell @kind logic */
import type { UpdateInfo, UpdaterCapabilities } from '../../../updater.type';
import type { UpdateStatus } from '../../updater-store.type';

const dialogTitle = (status: UpdateStatus, info: UpdateInfo | null, capabilities: UpdaterCapabilities): string => {
  if (!capabilities.hasSource) return 'No Update Source';
  if (!capabilities.canCheck) return 'Updates Unavailable';
  if (status === 'checking') return 'Checking for newer version...';
  return info ? 'Update Available' : 'Up To Date';
};

export { dialogTitle };
