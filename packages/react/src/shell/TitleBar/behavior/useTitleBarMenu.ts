/* @layer renderer-shell @kind hook */
import { useMemo } from 'react';
import type { MenuGroup } from '@drizztdourden08/tessera/composites';
import type { MenuEntry } from '../../../menu/menu.type';
import { navResolver } from '../../../menu/nav-resolver';
import { titleBarGroups } from './title-bar-groups';

const useTitleBarMenu = (menu: readonly MenuEntry[]): MenuGroup[] => useMemo(() => titleBarGroups(menu, navResolver), [menu]);

export { useTitleBarMenu };
