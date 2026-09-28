/* @layer renderer-shell @kind types */
type BootPhase = 'idle' | 'working' | 'ready' | 'error';

interface BootProgressState {
  phase: BootPhase;
  message: string;
  ratio: number | null;
  update: (patch: Partial<Pick<BootProgressState, 'phase' | 'message' | 'ratio'>>) => void;
  reset: () => void;
}

export type { BootPhase, BootProgressState };
