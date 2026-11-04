/* @layer core @kind types */
import type { SocketLink } from '../socket/socket-link.type';
import type { OnlineConnection } from './online-host.type';

interface ClientState {
  link: SocketLink | null;
  connection: OnlineConnection | null;
  stopped: boolean;
  failed: boolean;
  everConnected: boolean;
  closeReason: string;
  workingUrl: string | null;
  unsubscribeSwap: (() => void) | null;
}

export type { ClientState };
