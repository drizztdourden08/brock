/* @layer electron-main @kind constants */
import type { ListLimits } from './list-limits.type';

const LIST_LIMITS: ListLimits = { depth: 8, entries: 5000, ms: 5000, waiting: 4 };

const LIST_REVOKED = 'The folder grant was revoked while the folder was being listed';

const LIST_BUSY = 'Too many folder listings are waiting; try again shortly';

export { LIST_BUSY, LIST_LIMITS, LIST_REVOKED };
