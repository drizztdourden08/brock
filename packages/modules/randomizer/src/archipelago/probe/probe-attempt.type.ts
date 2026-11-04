/* @layer core @kind types */
import type { ProbeResult } from './probe.type';

interface AttemptResult {
  result: ProbeResult;
  opened: boolean;
}

export type { AttemptResult };
