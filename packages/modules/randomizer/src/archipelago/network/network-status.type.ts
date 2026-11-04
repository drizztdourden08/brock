/* @layer core @kind types */
type ConnectionState = 'idle' | 'connecting' | 'connected' | 'reconnecting' | 'refused' | 'closed';

interface NetworkPlayer {
  slot: number;
  team: number;
  name: string;
  game: string;
  status: string;
  online: boolean;
}

interface NetworkStatus {
  connection: ConnectionState;
  health: { pingMs?: number; lastPacketAt?: number };
  players: readonly NetworkPlayer[];
  server: { version?: string; seedName?: string; tags: readonly string[] };
  progress: { checked: number; total: number; received: number };
}

export type { ConnectionState, NetworkPlayer, NetworkStatus };
