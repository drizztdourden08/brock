/* @layer core @kind logic */
import type { DeliverResult } from '../../archipelago/client/online-host.type';
import type { ServerDeliveryDeps } from './server-delivery.type';

const deliverServerItem = <L>(
  itemName: string, senderName: string | null, onGranted: () => void, deps: ServerDeliveryDeps<L>,
): DeliverResult => {
  const local = deps.resolve(itemName);
  if (local === undefined) return 'unknown';
  const line = deps.arrivalLine(itemName, senderName);
  let arrival: number | null = null;
  const messageOf = (): number => {
    arrival ??= deps.openLine(line);
    return arrival;
  };
  const freeLine = (): void => {
    if (arrival !== null) deps.closeLine(arrival);
    arrival = null;
  };
  let entryId: string | null = null;
  entryId = deps.enqueue({
    local, message: itemName, messageOf, onComplete: freeLine,
    onGranted: () => {
      if (entryId !== null) deps.waiting.delete(entryId);
      onGranted();
    },
  });
  if (entryId === null) {
    freeLine();
    return 'not-ready';
  }
  deps.waiting.set(entryId, freeLine);
  return 'delivered';
};

export { deliverServerItem };
