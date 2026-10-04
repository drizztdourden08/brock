/* @layer renderer-shell @kind logic */
import { PARAM_PREFIX, ROUTE_SEPARATOR } from '../../navigation/navigation.constants';

const fillSubPath = (path: string, params: Readonly<Record<string, string>>): string => path
  .split(ROUTE_SEPARATOR)
  .map((part) => (part.startsWith(PARAM_PREFIX) ? encodeURIComponent(params[part.slice(PARAM_PREFIX.length)] ?? '') : part))
  .join(ROUTE_SEPARATOR);

export { fillSubPath };
