/* @layer renderer-shell @kind logic */
import { COMMAND_ZONE_ATTRIBUTE } from '../commands/commands.constants';
import { CONTEXT_MENU_ATTRIBUTE, CONTEXT_MENU_SELECTOR } from './context-menu.constants';

const findZoneElement = (zone: string): Element | null =>
  [...document.querySelectorAll(CONTEXT_MENU_SELECTOR)].find(
    (element) => element.getAttribute(CONTEXT_MENU_ATTRIBUTE) === zone || element.getAttribute(COMMAND_ZONE_ATTRIBUTE) === zone,
  ) ?? null;

export { findZoneElement };
