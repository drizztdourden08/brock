/* @layer core @kind logic */
import type { OnlineContext } from '../client/online-context.type';
import type { ReceivedItem } from '../client/online-host.type';
import { wireList } from '../network/wire-list';
import type { PacketOf } from './packet-handlers.type';

const receivedItemsOf = (ctx: OnlineContext, packet: PacketOf<'ReceivedItems'>): ReceivedItem[] => {
  const { room, names } = ctx;
  return wireList(packet.items).map((entry, offset) => ({
    index: packet.index + offset,
    item: entry.item,
    location: entry.location,
    player: entry.player,
    flags: entry.flags,
    itemName: room.itemNameById.get(entry.item) ?? names.itemName(entry.item, room.slot ?? 0),
    senderName: names.playerName(entry.player),
  }));
};

export { receivedItemsOf };
