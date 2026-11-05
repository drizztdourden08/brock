/* @layer renderer-shell @kind types */
import type { BrowsedLobby } from '../../../archipelago/lobby';

type BrowsedEntry = {
  server: string;
  lobby: BrowsedLobby;
};

export type { BrowsedEntry };
