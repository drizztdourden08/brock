/* @layer renderer-shell @kind logic */
import { ROUTE_SEPARATOR } from '../../../navigation/navigation.constants';
import type { SearchEntry } from '../../../search/search.type';
import type { HubDef } from '../../hub.type';

const pageIdOf = (hub: HubDef, entry: SearchEntry): string => entry.target?.route.split(ROUTE_SEPARATOR)[1] ?? hub.home.id;

export { pageIdOf };
