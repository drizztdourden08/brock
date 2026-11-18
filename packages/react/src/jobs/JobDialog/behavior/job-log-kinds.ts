/* @layer renderer-shell @kind logic */
import type { LogKindDef } from '@drizztdourden08/tessera/composites';
import type { I18n } from '@drizztdourden08/brock-core/i18n';

const jobLogKinds = (t: I18n['t']): readonly LogKindDef[] => [
  { id: 'info', label: t('brock-app:jobs.log.info') },
  { id: 'warn', label: t('brock-app:jobs.log.warn'), tone: 'warning', toneMessage: true },
  { id: 'error', label: t('brock-app:jobs.log.error'), tone: 'danger', toneMessage: true },
];

export { jobLogKinds };
