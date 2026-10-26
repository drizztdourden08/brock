/* @layer electron-main @kind logic */
import type { ProcessJobOutcome } from '@drizztdourden08/brock-core/types';

const withLogFile = (outcome: ProcessJobOutcome, logFile: string | undefined): ProcessJobOutcome =>
  logFile === undefined || outcome.status === 'rejected' ? outcome : { ...outcome, logFile };

export { withLogFile };
