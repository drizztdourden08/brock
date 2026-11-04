/* @layer core @kind logic */
import type { OnlineContext } from '../client/online-context.type';
import { SCOUT_REFUSED } from './dispatch.constants';
import type { PacketOf } from './packet-handlers.type';

const onInvalid = (ctx: OnlineContext, packet: PacketOf<'InvalidPacket'>): void => {
  ctx.log(`[Online] Server refused a ${packet.original_cmd ?? 'packet'}: ${packet.text}`, 'warn');
  const scoutRefusedBeforeArming = packet.original_cmd === 'LocationScouts' && !ctx.room.scouted;
  if (scoutRefusedBeforeArming) ctx.fail(SCOUT_REFUSED);
};

export { onInvalid };
