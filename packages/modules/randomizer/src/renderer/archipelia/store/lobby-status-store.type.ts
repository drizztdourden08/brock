/* @layer renderer-shell @kind types */
import type { ArchipeliaMembership } from '../membership/membership.type';

type LobbyLive = {
  connected: boolean;
  progress: { phase: string; fraction: number } | null;
};

type LobbyStatusState = {
  members: Readonly<Record<string, ArchipeliaMembership>>;
  live: Readonly<Record<string, LobbyLive>>;
  setMember: (profileId: string, membership: ArchipeliaMembership) => void;
  setLive: (profileId: string, live: LobbyLive) => void;
  drop: (profileId: string) => void;
};

export type { LobbyLive, LobbyStatusState };
