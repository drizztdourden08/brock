/* @layer core @kind types */
import type { NameTables } from '../data-package/name-tables.type';
import type { ApPrintJsonPacket } from '../protocol/server-packets.type';
import type { NoticePart } from './notice.type';

interface PrintSide {
  names: NameTables;
  slot: number | null;
  team: number | null;
}

interface SlotContext {
  packet: ApPrintJsonPacket;
  side: PrintSide;
  from: number;
  own: boolean;
  who: NoticePart;
}

export type { PrintSide, SlotContext };
