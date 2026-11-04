/* @layer core @kind logic */
import type { OnlineContext } from '../client/online-context.type';
import { wireList } from '../network/wire-list';
import type { PacketOf } from './packet-handlers.type';
import { releaseHeldReceived } from './release-held-received';
import { scoutedInputOf } from './scouted-input-of';

const onLocationInfo = (ctx: OnlineContext, packet: PacketOf<'LocationInfo'>): void => {
  const { room, host, deps } = ctx;
  if (room.scouted || room.reading === null) return;
  const input = scoutedInputOf(ctx, wireList(packet.locations));
  deps.placed(room.reading.placement(input));
  room.serverGrants = new Set(host.armScouted(input));
  room.scouted = true;
  releaseHeldReceived(ctx);
  host.startPolling();
};

export { onLocationInfo };
