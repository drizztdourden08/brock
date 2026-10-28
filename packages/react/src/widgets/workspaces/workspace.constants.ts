/* @layer renderer-shell @kind constants */
import type { MenuItem } from '../../menu/menu.type';

const WORKSPACE_KEY_PREFIX = 'workspace-';
const WORKSPACE_MENU: Pick<MenuItem, 'key' | 'label' | 'icon'> = { key: 'workspaces', label: 'Workspace', icon: 'layout-dashboard' };
const WORKSPACE_WORDS = { base: 'Standard', reset: 'Reset this workspace' } as const;

export { WORKSPACE_KEY_PREFIX, WORKSPACE_MENU, WORKSPACE_WORDS };
