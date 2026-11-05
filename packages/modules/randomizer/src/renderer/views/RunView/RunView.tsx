/* @layer renderer-shell @kind component */
import { EmptyState, Grid } from '@drizztdourden08/tessera/primitives';
import { useProfilesStore } from '@drizztdourden08/brock-react';
import { useRandomizerGame } from '../../game-registry/behavior/useRandomizerGame';
import { useRandomizerLabels } from '../../hooks/behavior/useRandomizerLabels';
import { DashboardCard } from '../dashboard/DashboardCard';
import { PANEL_MIN_WIDTH } from '../dashboard/dashboard.constants';
import { useOpenPage } from './behavior/useOpenPage';
import { NO_GAME_MESSAGE, NO_PROFILE_MESSAGE } from './RunView.constants';
import { GamePanel } from './sub-components/GamePanel';
import { RecentActivity } from './sub-components/RecentActivity';
import { RunPlayers } from './sub-components/RunPlayers';
import { RunProgress } from './sub-components/RunProgress';
import { RunSettings } from './sub-components/RunSettings';
import { RunSummary } from './sub-components/RunSummary';

const RunView = () => {
  const game = useRandomizerGame();
  const labels = useRandomizerLabels();
  const profile = useProfilesStore((state) => state.active);
  const open = useOpenPage();
  const config = profile?.randomizer;
  if (!game) return <EmptyState message={NO_GAME_MESSAGE} />;
  if (!profile || !config) {
    return (
      <Grid minColWidth={PANEL_MIN_WIDTH} gap="lg" dense>
        <DashboardCard span="full" title={labels.run}><EmptyState message={NO_PROFILE_MESSAGE} /></DashboardCard>
      </Grid>
    );
  }

  const panelProps = { config, mode: config.mode, romFile: config.romFile ?? null, open };

  return (
    <Grid minColWidth={PANEL_MIN_WIDTH} gap="lg" dense>
      <RunSummary profileName={profile.name} {...panelProps} />
      <RunProgress />
      <RecentActivity open={open} />
      {config.mode === 'online' && <RunPlayers />}
      <RunSettings {...panelProps} />
      {(game.views?.runPanels ?? []).map((panel, index) => (
        <GamePanel key={index} panel={panel} {...panelProps} />
      ))}
    </Grid>
  );
};

export { RunView };
