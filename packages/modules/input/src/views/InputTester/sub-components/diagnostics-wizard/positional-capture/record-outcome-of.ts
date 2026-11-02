/* @layer renderer-shell @kind logic */
import type { PositionalCaptureRecord, RecordOutcome } from './positional-capture.type';

const recordOutcomeOf = (record: PositionalCaptureRecord): RecordOutcome => {
  if (record.status === 'skipped') return { kind: 'skipped', text: 'Skipped' };
  if (record.mismatch) return { kind: 'mismatch', text: 'Different position than the preset' };
  return { kind: 'match', text: record.expectedIndex === null ? 'Recorded' : 'As expected' };
};

export { recordOutcomeOf };
