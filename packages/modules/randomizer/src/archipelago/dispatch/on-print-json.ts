/* @layer core @kind logic */
import type { OnlineContext } from '../client/online-context.type';
import { kindOfPrint } from '../messages/kind-of-print';
import { noticeOfPrint } from '../messages/notice-of-print';
import { printJsonText } from '../messages/print-json-text';
import { isPlayersReply } from '../network/is-players-reply';
import type { PacketOf } from './packet-handlers.type';

const onPrintJson = (ctx: OnlineContext, packet: PacketOf<'PrintJSON'>): void => {
  const { names, room } = ctx;
  const text = printJsonText(packet, names);
  if (text === '' || isPlayersReply(text)) return;
  ctx.log(`[AP] ${text}`);
  ctx.messages.push(kindOfPrint(packet.type), text);
  const notice = noticeOfPrint(packet, { names, slot: room.slot, team: room.team });
  if (notice !== null) ctx.emit({ type: 'notice', notice });
};

export { onPrintJson };
