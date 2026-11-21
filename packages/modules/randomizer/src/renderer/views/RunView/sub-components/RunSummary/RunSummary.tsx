/* @layer renderer-shell @kind component */
import { useText } from '@drizztdourden08/brock-react';
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
  const text = useText();
  const labels = useRandomizerLabels();
  const modeLabel = labels.modes?.[config.mode];
  const { session, status, summary, gameRunning } = useRandomizerSession();
  const online = config.mode === 'online';
  const counters = counterTilesOf(summary, labels.counters, text);
  const state = <Status tone={sessionToneOf(status)} variant="pill" dot>{status}</Status>;

  return (
    <DashboardCard span={RUN_SPANS.summary} title={text(SUMMARY_TITLE)} actions={state}>
      {online && <NetworkPill onOpen={() => open('network')} />}
      <StatTiles tiles={summaryTilesOf(profileName, config, modeLabel === undefined ? undefined : text(modeLabel), text)} />
      {counters.length > 0 && <StatTiles tiles={counters} />}
      {!session && !gameRunning && <Text variant="caption">{text(WAITING_MESSAGE)}</Text>}
    </DashboardCard>
  );
};

export { RunSummary };
