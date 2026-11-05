/* @layer renderer-shell @kind logic */
import type { ArchipelagoConnection } from '../../../augment';
import type { LobbyDraft } from '../../archipelia/lobby-setup';

const lobbyConnectionFieldsOf = (lobby: LobbyDraft, deathLink: boolean): ArchipelagoConnection => {
  const slotName = lobby.slotName.trim();
  return { deathLink, trackOtherPlayers: true, ...(slotName === '' ? {} : { slotName }) };
};

export { lobbyConnectionFieldsOf };
