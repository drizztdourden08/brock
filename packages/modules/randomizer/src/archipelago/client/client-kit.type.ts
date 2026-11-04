/* @layer core @kind types */
import type { NameTables } from '../data-package/name-tables.type';
import type { DeathLinkSwitch } from '../deathlink/death-link-switch.type';
import type { GoalReporter } from '../goal/goal.type';
import type { ConnectionUpdate } from '../messages/connection-notices.type';
import type { MessageLog } from '../messages/message-log-handle.type';
import type { NetworkMonitor } from '../network/network-monitor.type';
import type { ApClientPacket } from '../protocol/client-packets.type';
import type { OnlineRoom } from '../room/room.type';
import type { CreateSocket } from '../socket/socket-link.type';
import type { ClientDeps } from './client-deps.type';
import type { ClientEvent } from './client-event.type';
import type { ClientState } from './client-state.type';
import type { ListenerSet } from './listener-set.type';

interface ClientKit {
  deps: ClientDeps;
  state: ClientState;
  room: OnlineRoom;
  names: NameTables;
  messages: MessageLog;
  goal: GoalReporter;
  network: NetworkMonitor;
  deathLinks: DeathLinkSwitch;
  events: ListenerSet<[ClientEvent]>;
  createSocket: CreateSocket;
  send(packet: ApClientPacket): void;
  log(line: string, level?: 'warn' | 'error'): void;
  emit(event: ClientEvent): void;
  notifyConnection(update: ConnectionUpdate): void;
}

export type { ClientKit };
