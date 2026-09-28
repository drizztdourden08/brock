/* @layer renderer-shell @kind constants */
import type { UpdateAction } from './UpdateDialog.type';

const ACTION_LABELS: Record<UpdateAction, string> = {
  update: 'Update',
  reinstall: 'Reinstall',
  downgrade: 'Downgrade',
};

const RELEASES_GROUP = 'Releases';
const KIB = 1024;
const MIB = KIB * KIB;

export { ACTION_LABELS, RELEASES_GROUP, KIB, MIB };
