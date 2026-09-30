/* @layer renderer-shell @kind constants */
import type { LogKindDef } from '@drizztdourden08/tessera/composites';

const LOGS_WIDGET_ID = 'logs';
const LOG_ENTRY_LIMIT = 1000;
const HIDDEN_LEVELS_PREF = 'hiddenLevels';
const NO_HIDDEN_LEVELS: string[] = [];

const LOG_LEVEL_KINDS: readonly LogKindDef[] = [
  { id: 'info', label: 'Info' },
  { id: 'warn', label: 'Warn', tone: 'warning', toneMessage: true },
  { id: 'error', label: 'Error', tone: 'danger', toneMessage: true },
];

export { HIDDEN_LEVELS_PREF, LOG_ENTRY_LIMIT, LOG_LEVEL_KINDS, LOGS_WIDGET_ID, NO_HIDDEN_LEVELS };
