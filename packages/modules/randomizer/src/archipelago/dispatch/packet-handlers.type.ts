/* @layer core @kind types */
import type { OnlineContext } from '../client/online-context.type';
import type { ApServerPacket } from '../protocol/server-packets.type';

type PacketOf<C extends ApServerPacket['cmd']> = Extract<ApServerPacket, { cmd: C }>;

type PacketHandler = (ctx: OnlineContext, packet: ApServerPacket) => void;

type PacketHandlers = Readonly<Partial<Record<ApServerPacket['cmd'], PacketHandler>>>;

export type { PacketHandler, PacketHandlers, PacketOf };
