/* @layer renderer-shell @kind logic */
import { CELL_STATE_WORDS } from './positional-capture.constants';
import type { CellState } from './positional-capture.type';

const cellLabelOf = (label: string, state: CellState, result: string | undefined): string => {
  const base = `${label}, ${CELL_STATE_WORDS[state]}`;
  return result && state === 'done' ? `${base}, fired ${result}` : base;
};

export { cellLabelOf };
