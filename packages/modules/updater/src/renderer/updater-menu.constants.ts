/* @layer renderer-shell @kind constants */
import type { MenuEntry } from '@drizztdourden08/brock-react';
import { useUpdaterStore } from './useUpdaterStore';

const UPDATER_MENU: MenuEntry[] = [
  {
    key: 'updater:check',
    label: 'Check for updates',
    icon: 'refresh-cw',
    onClick: () => useUpdaterStore.getState().checkAndOpen(),
  },
];

export { UPDATER_MENU };
