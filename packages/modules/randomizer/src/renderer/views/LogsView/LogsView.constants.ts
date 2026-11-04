/* @layer renderer-shell @kind constants */
import type { LogKindDef } from '@drizztdourden08/tessera/composites';

const LOG_KINDS: readonly LogKindDef[] = [
  { id: 'info', label: 'Info', tone: 'secondary' },
  { id: 'warn', label: 'Warn', tone: 'warning', toneMessage: true },
  { id: 'error', label: 'Error', tone: 'danger', toneMessage: true },
];

const LOG_COUNT_LABEL = 'entries';
const LOG_EMPTY_LABEL = 'No activity yet.';

export { LOG_COUNT_LABEL, LOG_EMPTY_LABEL, LOG_KINDS };
