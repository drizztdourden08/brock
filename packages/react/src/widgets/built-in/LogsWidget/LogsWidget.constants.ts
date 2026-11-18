/* @layer renderer-shell @kind constants */
import { msg } from '@drizztdourden08/brock-core/i18n';
import type { Text } from '@drizztdourden08/brock-core/i18n';
import type { LogKindDef } from '@drizztdourden08/tessera/composites';
import type { FilterClause } from '@drizztdourden08/tessera/data';

const LOGS_WIDGET_ID = 'logs';
const LOG_ENTRY_LIMIT = 1000;
const FILTERS_PREF = 'filters';
const LOGS_EMPTY_LABEL = msg('brock-app:logs.empty');
const NO_FILTERS: readonly FilterClause[] = [];

const LOG_LEVEL_KINDS: readonly (Omit<LogKindDef, 'label'> & { label: Text })[] = [
  { id: 'info', label: msg('brock-app:logs.kind.info') },
  { id: 'warn', label: msg('brock-app:logs.kind.warn'), tone: 'warning', toneMessage: true },
  { id: 'error', label: msg('brock-app:logs.kind.error'), tone: 'danger', toneMessage: true },
];

export { FILTERS_PREF, LOG_ENTRY_LIMIT, LOG_LEVEL_KINDS, LOGS_EMPTY_LABEL, LOGS_WIDGET_ID, NO_FILTERS };
