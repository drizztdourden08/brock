/* @layer renderer-shell @kind logic */
import type { CallInput } from './positional-capture.type';

const callHeadlineOf = (input: CallInput): string => {
  const { current, answered, total, paused } = input;
  if (current) return current.label;
  if (total > 0 && answered >= total) return `All ${total} inputs answered`;
  return paused ? 'Capture is paused' : 'Getting ready';
};

export { callHeadlineOf };
