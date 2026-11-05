/* @layer core @kind logic */
import type { ReceivedItem } from '../client/online-host.type';

const receivedOrderBySender = (items: readonly ReceivedItem[]): readonly ReceivedItem[] =>
  [...items].sort((left, right) => left.player - right.player || left.index - right.index);

export { receivedOrderBySender };
