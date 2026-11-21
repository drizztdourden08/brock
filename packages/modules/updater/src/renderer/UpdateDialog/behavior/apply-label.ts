/* @layer renderer-shell @kind logic */
import type { Text } from '@drizztdourden08/brock-core/i18n';
import type { UpdateStatus } from '../../updater-store.type';
import type { UpdateAction } from '../UpdateDialog.type';
import { ACTION_LABELS, DOWNLOADING_LABEL, RESTARTING_LABEL } from '../UpdateDialog.constants';

const applyLabel = (status: UpdateStatus, action: UpdateAction): Text => {
  if (status === 'ready') return RESTARTING_LABEL;
  if (status === 'downloading') return DOWNLOADING_LABEL;
  return ACTION_LABELS[action];
};

export { applyLabel };
