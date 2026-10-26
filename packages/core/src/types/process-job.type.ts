/* @layer core @kind types */
type ProcessJobOutcome =
  | { status: 'done'; exitCode: number; tail: string[]; logFile?: string }
  | { status: 'failed'; exitCode: number | null; tail: string[]; error: string; logFile?: string }
  | { status: 'cancelled'; exitCode: number | null; tail: string[]; logFile?: string }
  | { status: 'detached'; exitCode: null; tail: string[]; error: string; logFile?: string }
  | { status: 'rejected'; error: string };

export type { ProcessJobOutcome };
