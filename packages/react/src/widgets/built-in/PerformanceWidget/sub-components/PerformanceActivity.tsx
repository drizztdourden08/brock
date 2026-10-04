/* @layer renderer-shell @kind component */
import { memo } from 'react';
import { Span, Stack, StatRow, Status } from '@drizztdourden08/tessera/primitives';
import type { StatusTone } from '@drizztdourden08/tessera/primitives';
import type { PerformanceActivityProps, RendererFeed } from '../PerformanceWidget.type';

const countTone = (count: number, tone: StatusTone): StatusTone => (count > 0 ? tone : 'neutral');

const longTaskText = (feed: RendererFeed | null): string => (feed && feed.longTasks > 0 ? `${feed.longTasks}, ${feed.longTaskMs.toFixed(0)} ms` : 'none');

const PerformanceActivityView = (props: PerformanceActivityProps) => {
  const { renderer, facts, shown } = props;
  const showRenderer = shown.includes('renderer');
  const showApp = shown.includes('app');
  if (!showRenderer && !showApp) return null;

  return (
    <Stack gap="xs" className="performance-widget__panel performance-widget__activity">
      <Span className="performance-widget__heading">Activity</Span>
      {showRenderer && <StatRow label={<Status tone={countTone(renderer?.longTasks ?? 0, 'warning')} dot>Long tasks</Status>} value={longTaskText(renderer)} mono />}
      {showApp && <StatRow label={<Status tone={countTone(facts.errors, 'danger')} dot>Errors</Status>} value={String(facts.errors)} mono />}
      {showApp && <StatRow label={<Status tone={countTone(facts.warnings, 'warning')} dot>Warnings</Status>} value={String(facts.warnings)} mono />}
    </Stack>
  );
};

const PerformanceActivity = memo(PerformanceActivityView);

export { PerformanceActivity };
