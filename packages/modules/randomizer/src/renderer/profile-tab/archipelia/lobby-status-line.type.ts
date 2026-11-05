/* @layer renderer-shell @kind types */
interface LobbyStatusLine {
  text: string;
  why?: string;
  tone: 'neutral' | 'success' | 'warning' | 'danger';
  busy: boolean;
  progress?: number;
  final: boolean;
}

export type { LobbyStatusLine };
