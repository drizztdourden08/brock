/* @layer renderer-shell @kind logic */
import type { UpdateInfo } from '../../../updater.type';
import type { UpdateStatus } from '../../updater-store.type';

const dialogTitle = (status: UpdateStatus, info: UpdateInfo | null): string => {
  if (status === 'checking') return 'Checking for updates';
  return info ? 'Update available' : 'Up to date';
};

export { dialogTitle };
