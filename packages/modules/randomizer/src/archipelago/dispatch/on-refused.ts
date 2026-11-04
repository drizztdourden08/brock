/* @layer core @kind logic */
import type { OnlineContext } from '../client/online-context.type';
import { refusalText } from '../handshake/refusal-text';
import { wireList } from '../network/wire-list';
import type { PacketOf } from './packet-handlers.type';

const onRefused = (ctx: OnlineContext, packet: PacketOf<'ConnectionRefused'>): void => {
  const codes = wireList(packet.errors);
  const text = refusalText(codes, ctx.connection().slotName, ctx.game);
  ctx.fail(`[Online] ${text}`, `[Online] Connection refused (${codes.join(', ') || 'no reason'}): ${text}`);
};

export { onRefused };
