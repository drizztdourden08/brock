/* @layer renderer-shell @kind types */
import type { HeldSeat, LobbyRef, OpenSeats } from '../../../archipelago/lobby';
import type { WorldPackageBuild } from '../world-package/world-package.type';

type LobbyCheckOk = {
  kind: 'ok';
  server: string;
  lobby: LobbyRef;
  name: string;
  ap: string;
  approval: boolean;
  seats: readonly HeldSeat[];
  open?: OpenSeats;
  build: WorldPackageBuild;
};

type LobbyCheck =
  | { kind: 'idle' }
  | { kind: 'checking' }
  | LobbyCheckOk
  | { kind: 'error'; text: string; code?: string };

export type { LobbyCheck, LobbyCheckOk };
