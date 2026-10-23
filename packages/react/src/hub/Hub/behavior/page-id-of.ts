/* @layer renderer-shell @kind logic */
import { ROUTE_SEPARATOR } from '../../../navigation/navigation.constants';
import type { SearchEntry } from '../../../search/search.type';
import type { HubDef } from '../../hub.type';

const isLiveSection = (hub: HubDef, section: string): boolean => hub.groups.some((group) => group.pages.some((page) => page.live !== undefined && page.id === section));

const pageIdOf = (hub: HubDef, entry: SearchEntry): string => {
  const [, section, ...rest] = entry.target?.route.split(ROUTE_SEPARATOR) ?? [];
  if (section === undefined) return hub.home.id;
  return rest.length > 0 && isLiveSection(hub, section) ? [section, ...rest].join(ROUTE_SEPARATOR) : section;
};

export { pageIdOf };
