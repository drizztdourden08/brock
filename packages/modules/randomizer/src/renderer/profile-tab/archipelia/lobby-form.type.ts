/* @layer renderer-shell @kind types */
import type { LobbyCheck } from '../../archipelia/check/lobby-check.type';
import type { LobbyDraft } from '../../archipelia/lobby-setup';

interface LobbyForm {
  lobby: LobbyDraft;
  lobbyCheck: LobbyCheck;
}

export type { LobbyForm };
