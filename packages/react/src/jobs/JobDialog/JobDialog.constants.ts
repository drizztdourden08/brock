/* @layer renderer-shell @kind constants */
import type { LogKindDef } from '@drizztdourden08/tessera/composites';

const JOB_LOG_KINDS: readonly LogKindDef[] = [
  { id: 'info', label: 'Info' },
  { id: 'warn', label: 'Warning', tone: 'warning', toneMessage: true },
  { id: 'error', label: 'Error', tone: 'danger', toneMessage: true },
];

const JOB_STATE_LABEL = {
  running: 'Running',
  done: 'Done',
  failed: 'Failed',
  cancelled: 'Cancelled',
} as const;

const FINISHED_STEP = 'job-finished';

export { FINISHED_STEP, JOB_LOG_KINDS, JOB_STATE_LABEL };
