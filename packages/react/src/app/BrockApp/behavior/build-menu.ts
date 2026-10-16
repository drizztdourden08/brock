/* @layer renderer-shell @kind logic */
import { dropEntries } from '../../../menu/drop-entries';
import { BAR_MARKER_KEYS } from '../../../menu/menu-config.constants';
import type { MenuEntry } from '../../../menu/menu.type';
import { visibleMenu } from '../../../menu/visible-menu';
import type { MenuBuildInput } from '../BrockApp.type';
import { resolveShellMenu } from './resolve-shell-menu';

const buildMenu = (input: MenuBuildInput): MenuEntry[] => dropEntries(visibleMenu(resolveShellMenu(input).entries), (item) => BAR_MARKER_KEYS.has(item.key));

export { buildMenu };
