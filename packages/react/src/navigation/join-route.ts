/* @layer renderer-shell @kind logic */
import { ROUTE_SEPARATOR } from './navigation.constants';

const joinRoute = (screen: string, page?: string, tab?: string): string =>
  [screen, page, page === undefined ? undefined : tab].filter((part) => part !== undefined && part !== '').join(ROUTE_SEPARATOR);

export { joinRoute };
