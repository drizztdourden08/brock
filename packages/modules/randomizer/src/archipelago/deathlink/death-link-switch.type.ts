/* @layer core @kind types */
import type { OnlineHost } from '../client/online-host.type';
import type { ApBouncedPacket } from '../protocol/server-packets.type';
import type { DeathLinkDeps } from './death-link.type';

interface DeathLinkSwitchDeps extends DeathLinkDeps {
  host: Pick<OnlineHost, 'killLink' | 'onLinkDied' | 'setDeathLink'>;
}

interface DeathLinkSwitch {
  set(enabled: boolean): void;
  handleBounced(packet: ApBouncedPacket): void;
  dispose(): void;
}

export type { DeathLinkSwitch, DeathLinkSwitchDeps };
