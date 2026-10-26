/* @layer renderer-shell @kind logic */
import { contextMenuAvailable } from '../context-menu/context-menu-available';
import { CONTEXT_MENU_ZONE } from '../context-menu/context-menu.constants';
import { COMMAND_ZONE_ATTRIBUTE } from './commands.constants';

const activeZones = (): string[] => {
  const zones: string[] = [];
  let zone = document.activeElement?.closest(`[${COMMAND_ZONE_ATTRIBUTE}]`) ?? null;
  while (zone !== null) {
    const name = zone.getAttribute(COMMAND_ZONE_ATTRIBUTE);
    if (name !== null) zones.push(name);
    zone = zone.parentElement?.closest(`[${COMMAND_ZONE_ATTRIBUTE}]`) ?? null;
  }
  return contextMenuAvailable(document.activeElement) ? [CONTEXT_MENU_ZONE, ...zones] : zones;
};

export { activeZones };
