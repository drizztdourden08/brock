/* @layer core @kind types */
type LobbyJoin = {
  server: string;
  code: string | null;
};

type LobbyJoinParse = { ok: true; value: LobbyJoin } | { ok: false; error: string };

export type { LobbyJoin, LobbyJoinParse };
