/* @layer renderer-shell @kind logic */
import { msg, type Text } from '@drizztdourden08/brock-core/i18n';
import type { UpdateInfo, UpdaterCapabilities } from '../../../updater.type';
import type { UpdateStatus } from '../../updater-store.type';

const dialogTitle = (status: UpdateStatus, info: UpdateInfo | null, capabilities: UpdaterCapabilities): Text => {
  if (!capabilities.hasSource) return msg('updater:dialog.title.noSource');
  if (!capabilities.canCheck) return msg('updater:dialog.title.unavailable');
  if (status === 'checking') return msg('updater:summary.checking');
  return info ? msg('updater:dialog.title.available') : msg('updater:dialog.title.upToDate');
};

export { dialogTitle };
