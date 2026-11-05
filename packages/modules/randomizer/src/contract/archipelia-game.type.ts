/* @layer core @kind types */
import type { LobbyClientIdentity } from '../archipelago/lobby';
import type { RandomizerProfileConfig } from '../augment';

type ArchipeliaGame = {
  module: string;
  worldVersion: string;
  client: LobbyClientIdentity;
  playerFile(config: RandomizerProfileConfig, appVersion: string): { slotName: string; yaml: string };
  assetUrl?(path: string): string;
  isLobbyProfile?(config: RandomizerProfileConfig): boolean;
};

export type { ArchipeliaGame };
