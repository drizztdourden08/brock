/* @layer renderer-shell @kind constants */
import { msg } from '@drizztdourden08/brock-core/i18n';
import type { MenuItemDef } from '../../menu/menu.type';

const WORKSPACE_KEY_PREFIX = 'workspace-';
const WORKSPACE_MENU: Pick<MenuItemDef, 'key' | 'label' | 'icon'> = { key: 'workspaces', label: msg('brock-app:workspaces.menu'), icon: 'layout-dashboard' };
const WORKSPACE_WORDS = { base: msg('brock-app:workspaces.base'), reset: msg('brock-app:workspaces.reset') } as const;

export { WORKSPACE_KEY_PREFIX, WORKSPACE_MENU, WORKSPACE_WORDS };
