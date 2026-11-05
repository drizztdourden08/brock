/* @layer renderer-shell @kind component */
import { useMemo } from 'react';
import { Button, Text } from '@drizztdourden08/tessera/primitives';
import { LogPanel } from '@drizztdourden08/tessera/composites';
import { useRandomizerLabels } from '../../../../hooks/behavior/useRandomizerLabels';
import { useRandomizerLog } from '../../../../hooks/behavior/useRandomizerLog';
import { useRoomMessages } from '../../../../online/hooks/behavior/useRoomMessages';
import { activityKindsOf } from '../../../activity/activity-kinds-of';
import { useActivityRules } from '../../../activity/behavior/useActivityRules';
import { recentActivityOf } from '../../../activity/recent-activity';
import { RECENT_HEIGHT } from '../../../activity/recent-activity.constants';
import { DashboardCard } from '../../../dashboard/DashboardCard';
import { RUN_SPANS } from '../../RunView.constants';
import { ACTIVITY_TITLE, NOTHING_YET, OPEN_LOG_LABEL } from './RecentActivity.constants';
import type { RecentActivityProps } from './RecentActivity.type';

const RecentActivity = ({ open }: RecentActivityProps) => {
  const labels = useRandomizerLabels();
  const entries = useRandomizerLog();
  const messages = useRoomMessages();
  const { rules, gameRules } = useActivityRules();
  const rows = useMemo(() => recentActivityOf(entries, messages, rules), [entries, messages, rules]);
  const kinds = useMemo(() => activityKindsOf(gameRules, labels.kinds), [gameRules, labels.kinds]);
  const openLog = <Button variant="secondary" size="sm" onClick={() => open('logs')}>{OPEN_LOG_LABEL}</Button>;

  return (
    <DashboardCard span={RUN_SPANS.activity} title={labels.events ?? ACTIVITY_TITLE} actions={openLog}>
      {rows.length === 0
        ? <Text variant="caption">{NOTHING_YET}</Text>
        : <LogPanel rows={rows} kinds={kinds} toolbar={false} height={RECENT_HEIGHT} />}
    </DashboardCard>
  );
};

export { RecentActivity };
