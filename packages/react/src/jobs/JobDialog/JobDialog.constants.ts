/* @layer renderer-shell @kind constants */
import type { LogKindDef } from '@drizztdourden08/tessera/composites';

const JOB_LOG_KINDS: readonly LogKindDef[] = [
  { id: 'info', label: 'Info' },
  { id: 'warn', label: 'Warning', tone: 'warning', toneMessage: true },
  { id: 'error', label: 'Error', tone: 'danger', toneMessage: true },
];

export { JOB_LOG_KINDS };
