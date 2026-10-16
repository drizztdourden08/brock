/* @layer renderer-shell @kind logic */
import { dropEntries } from '../../../menu/drop-entries';
import { VIEW_MENU_KEY } from '../../../menu/menu-config.constants';
import type { MenuEntry } from '../../../menu/menu.type';
import { visibleMenu } from '../../../menu/visible-menu';
import type { MenuBuildInput } from '../BrockApp.type';
import { resolveShellMenu } from './resolve-shell-menu';

const buildMenu = (input: MenuBuildInput): MenuEntry[] => dropEntries(visibleMenu(resolveShellMenu(input).entries), (item) => item.key === VIEW_MENU_KEY);

export { buildMenu };
