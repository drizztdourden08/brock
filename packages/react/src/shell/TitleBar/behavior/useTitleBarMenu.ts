/* @layer renderer-shell @kind hook */
import { useMemo } from 'react';
import type { MenuEntry } from '../../../menu/menu.type';
import { navResolver } from '../../../menu/nav-resolver';
import { titleBarGroups } from './title-bar-groups';
import type { TitleBarMenu } from './title-bar-menu.type';

const useTitleBarMenu = (menu: readonly MenuEntry[]): TitleBarMenu => useMemo(() => titleBarGroups(menu, navResolver), [menu]);

export { useTitleBarMenu };
