/* @layer renderer-shell @kind component */
import { memo } from 'react';
import type { I18n } from '@drizztdourden08/brock-core/i18n';
import { Span, Stack, StatRow, Status } from '@drizztdourden08/tessera/primitives';
import type { StatusTone } from '@drizztdourden08/tessera/primitives';
import { useT } from '../../../../i18n';
import type { PerformanceActivityProps, RendererFeed } from '../PerformanceWidget.type';

const countTone = (count: number, tone: StatusTone): StatusTone => (count > 0 ? tone : 'neutral');

const longTaskText = (feed: RendererFeed | null, t: I18n['t']): string =>
  (feed && feed.longTasks > 0 ? t('brock-app:perf.value.longTaskTotal', { count: feed.longTasks, ms: feed.longTaskMs.toFixed(0) }) : t('brock-app:perf.value.none'));

const PerformanceActivityView = (props: PerformanceActivityProps) => {
  const { renderer, facts, shown } = props;
  const t = useT();
  const showRenderer = shown.includes('renderer');
  const showApp = shown.includes('app');
  if (!showRenderer && !showApp) return null;

  return (
    <Stack gap="xs" className="performance-widget__panel performance-widget__activity">
      <Span className="performance-widget__heading">{t('brock-app:perf.activity')}</Span>
      {showRenderer && <StatRow label={<Status tone={countTone(renderer?.longTasks ?? 0, 'warning')} dot>{t('brock-app:perf.row.longTasks')}</Status>} value={longTaskText(renderer, t)} mono />}
      {showApp && <StatRow label={<Status tone={countTone(facts.errors, 'danger')} dot>{t('brock-app:perf.errors')}</Status>} value={String(facts.errors)} mono />}
      {showApp && <StatRow label={<Status tone={countTone(facts.warnings, 'warning')} dot>{t('brock-app:perf.warnings')}</Status>} value={String(facts.warnings)} mono />}
    </Stack>
  );
};

const PerformanceActivity = memo(PerformanceActivityView);

export { PerformanceActivity };
