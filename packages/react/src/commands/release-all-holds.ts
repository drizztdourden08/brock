/* @layer renderer-shell @kind logic */
import { activeHolds } from './active-holds';
import type { HoldCause } from './command.type';
import { releaseHolds } from './release-holds';

const releaseAllHolds = (cause: HoldCause): void => releaseHolds([...activeHolds.keys()], cause);

export { releaseAllHolds };
