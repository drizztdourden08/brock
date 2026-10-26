/* @layer renderer-shell @kind logic */
import { COMMAND_ZONE_ATTRIBUTE } from '../commands/commands.constants';
import { CONTEXT_MENU_ATTRIBUTE, CONTEXT_MENU_DATA_ATTRIBUTE, CONTEXT_MENU_SELECTOR } from './context-menu.constants';
import type { ContextMenuState, ZoneMatch } from './context-menu.type';
import { useContextMenuStore } from './useContextMenuStore';

const dataOf = (element: Element): unknown => {
  const raw = element.getAttribute(CONTEXT_MENU_DATA_ATTRIBUTE);
  if (raw === null) return undefined;
  try {
    return JSON.parse(raw) as unknown;
  } catch {
    return undefined;
  }
};

const matchOf = (element: Element, menus: ContextMenuState['menus']): ZoneMatch | null => {
  const names = [element.getAttribute(CONTEXT_MENU_ATTRIBUTE), element.getAttribute(COMMAND_ZONE_ATTRIBUTE)];
  const zone = names.find((name): name is string => name !== null && menus[name] !== undefined);
  const config = zone === undefined ? undefined : menus[zone];
  return zone === undefined || config === undefined ? null : { zone, element, config, data: dataOf(element) };
};

const zonesAt = (target: EventTarget | null): ZoneMatch[] => {
  const { menus } = useContextMenuStore.getState();
  const found: ZoneMatch[] = [];
  let element = target instanceof Element ? target.closest(CONTEXT_MENU_SELECTOR) : null;
  while (element !== null) {
    const match = matchOf(element, menus);
    if (match !== null) found.push(match);
    element = element.parentElement?.closest(CONTEXT_MENU_SELECTOR) ?? null;
  }
  return found;
};

export { zonesAt };
