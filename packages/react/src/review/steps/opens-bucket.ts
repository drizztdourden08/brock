/* @layer renderer-shell @kind logic */
import { ROUTE_SEPARATOR } from '../../navigation/navigation.constants';

const opensBucket = (id: string) => (screen: string | undefined): boolean =>
  screen === id || screen?.startsWith(`${id}${ROUTE_SEPARATOR}`) === true;

export { opensBucket };
