/* @layer renderer-shell @kind constants */
import { msg } from '@drizztdourden08/brock-core/i18n';

const RECENT_MENU_TEXT = {
  label: msg('brock-app:documents.recent.label'),
  none: msg('brock-app:documents.recent.none'),
  clear: msg('brock-app:documents.recent.clear'),
} as const;

const RECOVERY_TEXT = {
  title: msg('brock-app:documents.recovery.title'),
  restore: msg('brock-app:documents.recovery.restore'),
  discard: msg('brock-app:documents.recovery.discard'),
  later: msg('brock-app:documents.recovery.later'),
  unnamed: msg('brock-app:documents.recovery.unnamed'),
} as const;

export { RECENT_MENU_TEXT, RECOVERY_TEXT };
