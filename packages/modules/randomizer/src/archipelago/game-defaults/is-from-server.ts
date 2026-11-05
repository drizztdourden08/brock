/* @layer core @kind logic */
import type { ReceivedItem } from '../client/online-host.type';

const isFromServer = (item: ReceivedItem, slot: number): boolean =>
  item.location < 0 || item.player !== slot;

export { isFromServer };
