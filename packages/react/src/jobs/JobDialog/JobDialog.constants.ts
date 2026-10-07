/* @layer renderer-shell @kind constants */
import type { LogKindDef } from '@drizztdourden08/tessera/composites';

const JOB_LOG_KINDS: readonly LogKindDef[] = [
  { id: 'info', label: 'Info' },
  { id: 'warn', label: 'Warning', tone: 'warning', toneMessage: true },
  { id: 'error', label: 'Error', tone: 'danger', toneMessage: true },
];

const JOB_ID_ATTRIBUTE = 'data-job-id';

const DIALOG_SELECTOR = '[role="dialog"]';

export { DIALOG_SELECTOR, JOB_ID_ATTRIBUTE, JOB_LOG_KINDS };
