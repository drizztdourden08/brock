/* @layer core @kind logic */
import type { OnlineContext } from '../client/online-context.type';
import { markRoomChecked } from './mark-room-checked';
import type { PacketOf } from './packet-handlers.type';

const onRoomUpdate = (ctx: OnlineContext, packet: PacketOf<'RoomUpdate'>): void => {
  const { room, names } = ctx;
  if (Array.isArray(packet.players) && room.team !== null) {
    room.players = packet.players;
    names.setPlayers(packet.players, room.team);
  }
  if (Array.isArray(packet.checked_locations)) markRoomChecked(ctx, packet.checked_locations);
};

export { onRoomUpdate };
