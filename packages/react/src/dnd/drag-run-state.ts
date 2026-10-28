/* @layer renderer-shell @kind logic */
import type { Run } from './drag-run.type';

const runState: { current: Run | null } = { current: null };

export { runState };
