/* @layer renderer-shell @kind logic */
import type { HoldEntry } from './hold.type';

const activeHolds = new Map<string, HoldEntry>();

export { activeHolds };
