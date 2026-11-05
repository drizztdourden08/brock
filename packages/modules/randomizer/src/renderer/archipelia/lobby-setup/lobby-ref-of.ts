/* @layer renderer-shell @kind logic */
import type { LobbyRef } from '../../../archipelago/lobby';
import { connectModeOf } from './connect-mode-of';
import type { LobbyDraft } from './lobby-draft.type';
import { REF_STRATEGIES } from './lobby-ref-of.constants';

const lobbyRefOf = (draft: LobbyDraft): LobbyRef | null => REF_STRATEGIES[connectModeOf(draft)](draft);

export { lobbyRefOf };
