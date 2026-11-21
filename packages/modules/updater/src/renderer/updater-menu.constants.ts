/* @layer renderer-shell @kind constants */
import type { MenuEntryDef } from '@drizztdourden08/brock-react';
import { UPDATE_ACTION } from './update-action.constants';
import { useUpdaterStore } from './useUpdaterStore';

const UPDATER_MENU: MenuEntryDef[] = [
  {
    key: UPDATE_ACTION.id,
    label: UPDATE_ACTION.label,
    icon: UPDATE_ACTION.icon,
    onClick: () => useUpdaterStore.getState().checkAndOpen(),
  },
];

export { UPDATER_MENU };
