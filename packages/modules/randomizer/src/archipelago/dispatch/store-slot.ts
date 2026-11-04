/* @layer core @kind logic */
import type { OnlineContext } from '../client/online-context.type';
import { EARLY_CONNECT_WARNING, NO_SLOT_DATA, SLOT_DATA_WARNING } from './dispatch.constants';
import type { PacketOf } from './packet-handlers.type';

const storeSlot = (ctx: OnlineContext, packet: PacketOf<'Connected'>): boolean => {
  const { room, names } = ctx;
  if (room.gameData === null) ctx.log(EARLY_CONNECT_WARNING, 'warn');
  const reading = ctx.deps.slot(packet.slot_data);
  if (reading.kind === 'version') {
    ctx.fail(`[Online] ${reading.message}`);
    return false;
  }
  if (reading.kind === 'malformed') {
    ctx.log(SLOT_DATA_WARNING, 'warn');
    ctx.fail(NO_SLOT_DATA);
    return false;
  }
  room.reading = reading;
  room.team = packet.team;
  room.slot = packet.slot;
  room.players = Array.isArray(packet.players) ? packet.players : [];
  names.setPlayers(room.players, packet.team);
  if (packet.slot_info) names.setSlotInfo(packet.slot_info);
  return true;
};

export { storeSlot };
