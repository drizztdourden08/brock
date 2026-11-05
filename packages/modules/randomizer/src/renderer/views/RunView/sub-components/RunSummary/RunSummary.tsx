/* @layer renderer-shell @kind component */
import { Status, Text } from '@drizztdourden08/tessera/primitives';
import { useRandomizerLabels } from '../../../../hooks/behavior/useRandomizerLabels';
import { useRandomizerSession } from '../../../../hooks/behavior/useRandomizerSession';
import { DashboardCard } from '../../../dashboard/DashboardCard';
import { sessionToneOf } from '../../../dashboard/session-tone';
import { StatTiles } from '../../../dashboard/StatTiles';
import { NetworkPill } from '../../../NetworkView';
import { counterTilesOf } from '../../behavior/counter-tiles';
import { summaryTilesOf } from '../../behavior/summary-tiles';
import { RUN_SPANS } from '../../RunView.constants';
import { SUMMARY_TITLE, WAITING_MESSAGE } from './RunSummary.constants';
import type { RunSummaryProps } from './RunSummary.type';

const RunSummary = ({ profileName, config, open }: RunSummaryProps) => {
  const labels = useRandomizerLabels();
  const { session, status, summary, gameRunning } = useRandomizerSession();
  const online = config.mode === 'online';
  const counters = counterTilesOf(summary, labels.counters);
  const state = <Status tone={sessionToneOf(status)} variant="pill" dot>{status}</Status>;

  return (
    <DashboardCard span={RUN_SPANS.summary} title={SUMMARY_TITLE} actions={state}>
      {online && <NetworkPill onOpen={() => open('network')} />}
      <StatTiles tiles={summaryTilesOf(profileName, config, labels.modes?.[config.mode])} />
      {counters.length > 0 && <StatTiles tiles={counters} />}
      {!session && !gameRunning && <Text variant="caption">{WAITING_MESSAGE}</Text>}
    </DashboardCard>
  );
};

export { RunSummary };
