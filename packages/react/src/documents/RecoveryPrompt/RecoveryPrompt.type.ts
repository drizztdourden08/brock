/* @layer renderer-shell @kind types */
import type { RecoverableSnapshot } from '@drizztdourden08/brock-core';

interface RecoveryPromptState {
  current: RecoverableSnapshot | null;
  waiting: number;
  restore: () => void;
  discard: () => void;
  later: () => void;
}

export type { RecoveryPromptState };
