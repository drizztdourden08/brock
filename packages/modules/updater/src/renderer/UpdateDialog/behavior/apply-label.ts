/* @layer renderer-shell @kind logic */
import type { UpdateStatus } from '../../updater-store.type';
import type { UpdateAction } from '../UpdateDialog.type';
import { ACTION_LABELS } from '../UpdateDialog.constants';

const applyLabel = (status: UpdateStatus, action: UpdateAction): string => {
  if (status === 'ready') return 'Restarting...';
  if (status === 'downloading') return 'Downloading...';
  return ACTION_LABELS[action];
};

export { applyLabel };
