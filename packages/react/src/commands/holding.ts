/* @layer renderer-shell @kind logic */
import { activeHolds } from './active-holds';

const holding = (id: string): boolean => activeHolds.has(id);

export { holding };
