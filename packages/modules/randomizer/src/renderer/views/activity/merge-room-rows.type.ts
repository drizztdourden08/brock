/* @layer renderer-shell @kind types */
import type { LogRow } from '@drizztdourden08/tessera/composites';

interface TimedRow {
  at: number;
  row: LogRow;
}

export type { TimedRow };
