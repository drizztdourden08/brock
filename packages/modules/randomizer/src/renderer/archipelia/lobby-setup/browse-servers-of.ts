/* @layer renderer-shell @kind logic */
import { LOBBY_DEFAULT_PORT } from '../../../archipelago/lobby';
import type { LanServer } from '../../../archipelago/lobby';
import { connectModeOf } from './connect-mode-of';
import { LOCAL_HOST } from './lobby-draft.constants';
import type { LobbyDraft } from './lobby-draft.type';

const browseServersOf = (draft: LobbyDraft, lan: readonly LanServer[]): string[] => {
  if (connectModeOf(draft) !== 'auto') return [];
  if (draft.location === 'local') return [`${LOCAL_HOST}:${LOBBY_DEFAULT_PORT}`];
  return lan.filter((server) => server.compatible).map((server) => `${server.address}:${server.port}`);
};

export { browseServersOf };
