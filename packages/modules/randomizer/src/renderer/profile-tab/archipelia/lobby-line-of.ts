/* @layer renderer-shell @kind logic */
import { freeSeats } from '../../../archipelago/lobby';
import type { LobbyLineState } from '../../archipelia/LobbySetup';
import type { LobbyCheck } from '../../archipelia/check/lobby-check.type';

const lobbyLineOf = (check: LobbyCheck): LobbyLineState =>
  (check.kind === 'ok' ? { kind: 'ok', name: check.name, ap: check.ap, approval: check.approval, seats: freeSeats(check.seats), ...(check.open === undefined ? {} : { open: check.open }) } : check);

export { lobbyLineOf };
