/* @layer renderer-shell @kind types */
import type { LobbyDraft } from '../lobby-setup';

interface LobbyRow {
  id: string;
  name: string;
  address: string;
  ap?: string;
  supported: boolean;
  open: boolean;
  seats: string;
}

type LobbyLineState =
  | { kind: 'idle' }
  | { kind: 'checking' }
  | { kind: 'ok'; name: string; ap: string; approval: boolean; seats: readonly string[]; open?: { total: number; free: number } }
  | { kind: 'error'; text: string };

interface LobbyAccess {
  refreshing: boolean;
  onRefresh: () => void;
  blocked: boolean;
  onAllow: () => void;
}

interface LobbySetupProps {
  value: LobbyDraft;
  onChange: (part: Partial<LobbyDraft>) => void;
  lobbies: readonly LobbyRow[];
  lobby: LobbyLineState;
  access?: LobbyAccess;
  disabled?: boolean;
}

export type { LobbyAccess, LobbyLineState, LobbyRow, LobbySetupProps };
