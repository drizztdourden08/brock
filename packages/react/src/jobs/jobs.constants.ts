/* @layer renderer-shell @kind constants */
import type { StatusTone } from '@drizztdourden08/tessera/primitives';
import type { JobState } from '@drizztdourden08/brock-core/types';

const JOB_BAR_ID = 'brock-jobs';

const JOB_BAR_LABEL = 'Background job';

const JOB_BAR_TONE: Record<JobState, StatusTone> = {
  running: 'info',
  done: 'success',
  failed: 'danger',
  cancelled: 'warning',
};

export { JOB_BAR_ID, JOB_BAR_LABEL, JOB_BAR_TONE };
