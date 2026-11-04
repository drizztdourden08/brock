/* @layer core @kind types */
import type { OnlineHost } from '../client/online-host.type';
import type { ApClientPacket } from '../protocol/client-packets.type';
import type { ApBouncedPacket } from '../protocol/server-packets.type';

type DeathLinkNotice =
  | { kind: 'received' | 'dropped'; source: string; cause: string }
  | { kind: 'sent' };

interface DeathLinkDeps {
  send(packet: ApClientPacket): void;
  slotName(): string;
  host: Pick<OnlineHost, 'killLink' | 'onLinkDied'>;
  log(line: string, level?: 'warn' | 'error'): void;
  notify(notice: DeathLinkNotice): void;
  now?(): number;
}

interface DeathLink {
  handleBounced(packet: ApBouncedPacket): void;
  dispose(): void;
}

export type { DeathLink, DeathLinkDeps, DeathLinkNotice };
