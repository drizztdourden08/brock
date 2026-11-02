/* @layer renderer-shell @kind logic */
import type { CallInput } from './positional-capture.type';

const callDetailOf = (input: CallInput): string => {
  const { current, instruction, answered, total } = input;
  if (current) return instruction;
  if (total > 0 && answered >= total) return 'Press Next to see the summary.';
  return 'Press Auto-Advance All, or pick an input below, to carry on.';
};

export { callDetailOf };
