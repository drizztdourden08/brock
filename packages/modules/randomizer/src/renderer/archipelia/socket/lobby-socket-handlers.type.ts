/* @layer renderer-shell @kind types */
type LobbySocketHandlers = {
  open?: () => void;
  message?: (text: string) => void;
  close?: (code: number) => void;
};

export type { LobbySocketHandlers };
