/* @layer renderer-shell @kind constants */
import type { LogKindDef } from '@drizztdourden08/tessera/composites';
import type { FilterClause } from '@drizztdourden08/tessera/data';

const LOGS_WIDGET_ID = 'logs';
const LOG_ENTRY_LIMIT = 1000;
const FILTERS_PREF = 'filters';
const NO_FILTERS: readonly FilterClause[] = [];

const LOG_LEVEL_KINDS: readonly LogKindDef[] = [
  { id: 'info', label: 'Info' },
  { id: 'warn', label: 'Warn', tone: 'warning', toneMessage: true },
  { id: 'error', label: 'Error', tone: 'danger', toneMessage: true },
];

export { FILTERS_PREF, LOG_ENTRY_LIMIT, LOG_LEVEL_KINDS, LOGS_WIDGET_ID, NO_FILTERS };
