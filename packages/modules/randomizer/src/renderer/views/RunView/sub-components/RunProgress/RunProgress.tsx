/* @layer renderer-shell @kind component */
import { useText } from '@drizztdourden08/brock-react';
import { ProgressBar, Text } from '@drizztdourden08/tessera/primitives';
import { useNetworkStatus } from '../../../../online/hooks/behavior/useNetworkStatus';
import { useTrackerReading } from '../../../../tracker/hooks/behavior/useTrackerReading';
import { DashboardCard } from '../../../dashboard/DashboardCard';
import { StatTiles } from '../../../dashboard/StatTiles';
import { checkCountsOf } from '../../behavior/check-counts-of';
import { percentOf } from '../../behavior/checks-percent';
import { progressTilesOf } from '../../behavior/progress-tiles';
import { RUN_SPANS } from '../../RunView.constants';
import { NO_PROGRESS_MESSAGE, PROGRESS_LABEL, PROGRESS_TITLE } from './RunProgress.constants';

const RunProgress = () => {
  const text = useText();
  const reading = useTrackerReading();
  const room = useNetworkStatus()?.progress ?? null;
  const counts = checkCountsOf(reading?.counts ?? null, room);
  const tiles = progressTilesOf(counts, room, text);

  return (
    <DashboardCard span={RUN_SPANS.progress} title={text(PROGRESS_TITLE)}>
      {counts === null ? (
        <Text variant="caption">{text(NO_PROGRESS_MESSAGE)}</Text>
      ) : (
        <ProgressBar
          value={counts.taken}
          secondaryValue={counts.available === null ? undefined : counts.taken + counts.available}
          secondaryTone="primary"
          tone="secondary"
          max={Math.max(counts.total, 1)}
          label={text(PROGRESS_LABEL)}
          showValue
          formatValue={() => `${percentOf(counts)}%`}
        />
      )}
      {tiles.length > 0 && <StatTiles tiles={tiles} />}
    </DashboardCard>
  );
};

export { RunProgress };
