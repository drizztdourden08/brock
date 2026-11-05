/* @layer renderer-shell @kind types */
import type { LobbySession } from '../../../archipelago/lobby';

type Watched = {
  session: LobbySession;
  stop: () => void;
};

export type { Watched };
