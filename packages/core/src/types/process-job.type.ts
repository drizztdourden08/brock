/* @layer core @kind types */
type ProcessJobOutcome =
  | { status: 'done'; exitCode: number; tail: string[] }
  | { status: 'failed'; exitCode: number | null; tail: string[]; error: string }
  | { status: 'cancelled'; exitCode: number | null; tail: string[] }
  | { status: 'rejected'; error: string };

export type { ProcessJobOutcome };
