/* @layer core @kind types */
type ConnectionState = 'idle' | 'connecting' | 'connected' | 'reconnecting' | 'refused' | 'closed';

interface NetworkPlayer {
  slot: number;
  team: number;
  name: string;
  game: string;
  status: string;
  online: boolean | null;
  checked: number | null;
  total: number | null;
}

interface ReconnectStatus {
  attempt: number;
  nextRetryAt: number | null;
  inFlight: boolean;
}

interface NetworkStatus {
  connection: ConnectionState;
  health: { pingMs?: number; pingMeanMs?: number; pingSamples: number; lastPacketAt?: number };
  reconnect: ReconnectStatus;
  players: readonly NetworkPlayer[];
  server: { version?: string; seedName?: string; hintPoints?: number; tags: readonly string[] };
  progress: { checked: number; total: number; received: number; sentToOthers: number };
}

export type { ConnectionState, NetworkPlayer, NetworkStatus };
