/* @layer electron-main @kind logic */
import type { JobHandle } from '@drizztdourden08/brock-core/jobs';
import type { ProcessJobOutcome } from '@drizztdourden08/brock-core/types';

const settleJob = (job: JobHandle, outcome: ProcessJobOutcome): void => {
  if (outcome.status === 'done') job.done();
  else if (outcome.status === 'failed' || outcome.status === 'detached') job.fail(new Error(outcome.error));
};

export { settleJob };
