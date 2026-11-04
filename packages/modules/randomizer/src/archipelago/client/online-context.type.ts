/* @layer core @kind types */
import type { NameTables } from '../data-package/name-tables.type';
import type { GoalReporter } from '../goal/goal.type';
import type { MessageLog } from '../messages/message-log-handle.type';
import type { NetworkMonitor } from '../network/network-monitor.type';
import type { ApClientPacket } from '../protocol/client-packets.type';
import type { ApBouncedPacket } from '../protocol/server-packets.type';
import type { OnlineRoom } from '../room/room.type';
import type { ClientDeps } from './client-deps.type';
import type { ClientEvent } from './client-event.type';
import type { OnlineConnection, OnlineHost } from './online-host.type';

interface OnlineContext {
  readonly deps: ClientDeps;
  readonly host: OnlineHost;
  readonly game: string;
  readonly room: OnlineRoom;
  readonly names: NameTables;
  readonly messages: MessageLog;
  readonly goal: GoalReporter;
  readonly network: Pick<NetworkMonitor, 'received' | 'changed'>;
  connection(): OnlineConnection;
  send(packet: ApClientPacket): void;
  log(line: string, level?: 'warn' | 'error'): void;
  emit(event: ClientEvent): void;
  fail(message: string, logLine?: string): void;
  markConnected(): void;
  isLive(): boolean;
  setDeathLink(enabled: boolean): void;
  bounced(packet: ApBouncedPacket): void;
}

export type { OnlineContext };
