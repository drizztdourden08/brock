/* @layer renderer-shell @kind logic */
import type { I18n } from '@drizztdourden08/brock-core/i18n';
import { formatUnits } from '../../../../diagnostics/format-units';
import type { AppFacts, PerformanceRow } from '../PerformanceWidget.type';

const appRows = (facts: AppFacts, t: I18n['t']): PerformanceRow[] => {
  const none = t('brock-app:perf.value.none');
  const listText = (items: readonly string[]): string => (items.length > 0 ? items.join(', ') : none);
  return [
    { label: t('brock-app:perf.row.version'), value: facts.version },
    { label: t('brock-app:perf.row.screen'), value: facts.screen ?? t('brock-app:perf.value.home') },
    { label: t('brock-app:perf.row.route'), value: formatUnits.orDash(facts.route) },
    { label: t('brock-app:perf.row.profile'), value: facts.profile ?? none },
    { label: t('brock-app:perf.row.openWidgets'), value: listText(facts.openWidgets) },
    { label: t('brock-app:perf.row.modules'), value: listText(facts.modules) },
    { label: t('brock-app:perf.row.log'), value: t('brock-app:perf.value.logCounts', { errors: facts.errors, warnings: facts.warnings }) },
  ];
};

export { appRows };
