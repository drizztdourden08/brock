/* @layer renderer-shell @kind constants */
import { msg } from '@drizztdourden08/brock-core/i18n';

const UPDATE_ACTION = {
  id: 'updater:check',
  label: msg('updater:action.check'),
  icon: 'refresh-cw',
  available: msg('updater:action.available'),
} as const;

export { UPDATE_ACTION };
