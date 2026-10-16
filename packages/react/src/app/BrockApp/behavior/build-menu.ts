/* @layer renderer-shell @kind logic */
import type { MenuEntry } from '../../../menu/menu.type';
import { visibleMenu } from '../../../menu/visible-menu';
import type { MenuBuildInput } from '../BrockApp.type';
import { resolveShellMenu } from './resolve-shell-menu';

const buildMenu = (input: MenuBuildInput): MenuEntry[] => visibleMenu(resolveShellMenu(input).entries);

export { buildMenu };
