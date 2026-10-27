/* @layer renderer-shell @kind logic */
import type { InputStatus } from '../../hid-calibration/hid-calibration.type';
import type { CellState } from './positional-capture.type';

const cellStateOf = (status: InputStatus, isCurrent: boolean): CellState => {
  if (status === 'captured') return 'done';
  if (status === 'skipped') return 'skipped';
  return isCurrent ? 'current' : 'pending';
};

export { cellStateOf };
