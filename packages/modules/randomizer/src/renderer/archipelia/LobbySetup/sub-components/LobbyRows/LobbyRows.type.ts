/* @layer renderer-shell @kind types */
import type { LobbyRow } from '../../LobbySetup.type';

interface LobbyRowsProps {
  lobbies: readonly LobbyRow[];
  picked: string | null;
  onPick: (lobby: LobbyRow) => void;
  disabled: boolean;
}

export type { LobbyRowsProps };
