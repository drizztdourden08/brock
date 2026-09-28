/* @layer renderer-shell @kind logic */
import type { VersionOption } from '../../../updater.type';
import type { UpdateAction } from '../UpdateDialog.type';

const actionFor = (chosen: VersionOption | null): UpdateAction => {
  if (chosen?.installed) return 'reinstall';
  if (chosen?.downgrade) return 'downgrade';
  return 'update';
};

export { actionFor };
