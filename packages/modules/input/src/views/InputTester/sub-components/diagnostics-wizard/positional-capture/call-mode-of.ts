/* @layer renderer-shell @kind logic */
import type { CallInput, CallMode } from './positional-capture.type';

const callModeOf = (input: CallInput): CallMode => {
  if (input.current) return 'act';
  if (input.total > 0 && input.answered >= input.total) return 'done';
  return 'idle';
};

export { callModeOf };
