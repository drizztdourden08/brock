/* @layer renderer-shell @kind logic */
import { msg, type Text } from '@drizztdourden08/brock-core/i18n';
import type { LobbyRow } from '../../archipelia/LobbySetup';
import type { BrowsedEntry } from '../../archipelia/browse/browsed-entry.type';

const seatsOf = ({ free, total }: BrowsedEntry['lobby']['seats'], text: (value: Text) => string): string =>
  text(msg('randomizer:lobby.rows.seatsFree', { free, total }));

const lobbyRowsOf = (entries: readonly BrowsedEntry[], versions: readonly string[], text: (value: Text) => string): LobbyRow[] =>
  entries.map(({ server, lobby }) => ({
    id: lobby.joinToken,
    name: lobby.name,
    address: server,
    ap: lobby.engine.ap,
    supported: versions.includes(lobby.engine.ap),
    open: lobby.joinable,
    seats: seatsOf(lobby.seats, text),
  }));

export { lobbyRowsOf };
