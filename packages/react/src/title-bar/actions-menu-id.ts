/* @layer renderer-shell @kind logic */
import { DEFAULT_ACTIONS_MENU_ID } from './title-bar.constants';
import type { TitleBarActionsMenu } from './title-bar-item.type';

const actionsMenuId = (menu: TitleBarActionsMenu): string => menu.id ?? DEFAULT_ACTIONS_MENU_ID;

export { actionsMenuId };
