/* @layer renderer-shell @kind logic */
import { COMMAND_ZONE_ATTRIBUTE } from './commands.constants';

const activeZones = (): string[] => {
  const zones: string[] = [];
  let zone = document.activeElement?.closest(`[${COMMAND_ZONE_ATTRIBUTE}]`) ?? null;
  while (zone !== null) {
    const name = zone.getAttribute(COMMAND_ZONE_ATTRIBUTE);
    if (name !== null) zones.push(name);
    zone = zone.parentElement?.closest(`[${COMMAND_ZONE_ATTRIBUTE}]`) ?? null;
  }
  return zones;
};

export { activeZones };
