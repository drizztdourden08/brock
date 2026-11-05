/* @layer renderer-shell @kind types */
import type { LobbyClientInfo, LobbyRef, LobbySession } from '../../../archipelago/lobby';
import type { RandomizerProfileConfig } from '../../../augment';
import type { ArchipeliaMembership } from '../membership/membership.type';
import type { WorldPackageBuild } from '../world-package/world-package.type';

type JoinInput = {
  server: string;
  lobby: LobbyRef;
  ap: string;
  slotName: string;
  yaml: string;
  build: WorldPackageBuild;
  bytes: Uint8Array;
  client: LobbyClientInfo;
  seat?: string;
  token?: string;
};

type StartJoinInput = {
  server: string;
  lobby: LobbyRef;
  ap: string;
  config: RandomizerProfileConfig;
  seat?: string;
  token?: string;
};

type JoinFormOptions = {
  wanted: string | null;
  onProgress: (fraction: number) => void;
};

type JoinOutcome =
  | { ok: true; session: LobbySession; membership: ArchipeliaMembership }
  | { ok: false; error: string; code?: string };

type StartJoinResult = { session: LobbySession } | { error: string };

export type { JoinFormOptions, JoinInput, JoinOutcome, StartJoinInput, StartJoinResult };
