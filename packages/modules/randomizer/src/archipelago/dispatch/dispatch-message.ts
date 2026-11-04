/* @layer core @kind logic */
import type { OnlineContext } from '../client/online-context.type';
import { parseServerPackets } from '../handshake/parse-server-packets';
import { dispatchPacket } from './dispatch-packet';

const dispatchMessage = (ctx: OnlineContext, data: string): void => {
  for (const packet of parseServerPackets(data)) {
    if (!ctx.network.received(packet)) dispatchPacket(ctx, packet);
  }
  ctx.network.changed();
};

export { dispatchMessage };
