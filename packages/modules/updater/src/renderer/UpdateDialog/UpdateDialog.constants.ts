/* @layer renderer-shell @kind constants */
import { msg, type Text } from '@drizztdourden08/brock-core/i18n';
import type { UpdateAction } from './UpdateDialog.type';

const ACTION_LABELS: Record<UpdateAction, Text> = {
  update: msg('updater:dialog.action.update'),
  reinstall: msg('updater:dialog.action.reinstall'),
  downgrade: msg('updater:dialog.action.downgrade'),
};

const RELEASES_GROUP = msg('updater:picker.group.releases');
const RESTARTING_LABEL = msg('updater:dialog.restarting');
const DOWNLOADING_LABEL = msg('updater:dialog.downloading');
const KIB = 1024;
const MIB = KIB * KIB;

export { ACTION_LABELS, DOWNLOADING_LABEL, RELEASES_GROUP, RESTARTING_LABEL, KIB, MIB };
