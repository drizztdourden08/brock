/* @layer renderer-shell @kind types */
import type { LobbyDraft } from '../../../lobby-setup';
import type { LobbyAccess, LobbyLineState, LobbyRow } from '../../LobbySetup.type';

interface ConnectionSectionProps {
  value: LobbyDraft;
  onChange: (part: Partial<LobbyDraft>) => void;
  lobbies: readonly LobbyRow[];
  lobby: LobbyLineState;
  access?: LobbyAccess;
  disabled: boolean;
}

export type { ConnectionSectionProps };
