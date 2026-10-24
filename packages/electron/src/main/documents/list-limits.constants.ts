/* @layer electron-main @kind constants */
import type { ListLimits } from './list-limits.type';

const LIST_LIMITS: ListLimits = { depth: 8, entries: 5000, ms: 5000 };

const LIST_REVOKED = 'The folder grant was revoked while the folder was being listed';

export { LIST_LIMITS, LIST_REVOKED };
