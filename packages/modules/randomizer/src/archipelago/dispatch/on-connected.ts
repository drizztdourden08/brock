/* @layer core @kind logic */
import type { OnlineContext } from '../client/online-context.type';
import { bindSaveToRoom } from '../room/bind-save-to-room';
import { applySlotDeathLink } from './apply-slot-death-link';
import { markRoomChecked } from './mark-room-checked';
import type { PacketOf } from './packet-handlers.type';
import { resendUnsentChecks } from './resend-unsent-checks';
import { scoutOnce } from './scout-once';
import { storeSlot } from './store-slot';

const onConnected = (ctx: OnlineContext, packet: PacketOf<'Connected'>): void => {
  const { room } = ctx;
  if (!storeSlot(ctx, packet)) return;
  if (!bindSaveToRoom(ctx)) return;
  room.connected = true;
  room.checked = new Set();
  room.missing = new Set();
  markRoomChecked(ctx, packet.checked_locations, packet.missing_locations);
  ctx.markConnected();
  applySlotDeathLink(ctx);
  ctx.goal.onConnected();
  resendUnsentChecks(ctx);
  scoutOnce(ctx);
  if (room.scouted) ctx.host.startPolling();
};

export { onConnected };
