/* @layer core @kind types */
type LobbySocketEvent =
  | { id: string; kind: 'open' }
  | { id: string; kind: 'message'; text: string }
  | { id: string; kind: 'error' }
  | { id: string; kind: 'close'; code: number };

export type { LobbySocketEvent };
