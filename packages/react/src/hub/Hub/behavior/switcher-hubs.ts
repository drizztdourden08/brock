/* @layer renderer-shell @kind logic */
import type { HubDef } from '../../hub.type';

const switcherHubs = (hubs: readonly HubDef[]): HubDef[] => hubs.filter((hub) => hub.switcher !== false);

export { switcherHubs };
