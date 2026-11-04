/* @layer renderer-shell @kind types */
type ServerCheckPhase = 'idle' | 'checking' | 'done';

interface ServerCheck {
  phase: ServerCheckPhase;
  message: string | null;
  check(): void;
}

export type { ServerCheck, ServerCheckPhase };
