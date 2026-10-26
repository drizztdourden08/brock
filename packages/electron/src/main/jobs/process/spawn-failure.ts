/* @layer electron-main @kind logic */
import type { ProcessJobOutcome } from '@drizztdourden08/brock-core/types';
import type { ProcessRunOptions } from './process-job.type';

const spawnFailure = (options: ProcessRunOptions, reason: unknown, tail: string[]): ProcessJobOutcome => {
  const detail = reason instanceof Error ? reason.message : String(reason);
  return { status: 'failed', exitCode: null, tail, error: `${options.label} could not start: ${detail}` };
};

export { spawnFailure };
