/* @layer renderer-shell @kind component */
import { Card, EmptyState, Grid, StatRow, Stack } from '@drizztdourden08/tessera/primitives';
import { useRandomizerGame } from '../../game-registry/use-randomizer-game';
import { useRandomizerLabels } from '../../hooks/use-randomizer-labels';
import { useRandomizerSession } from '../../hooks/use-randomizer-session';
import {
  GAME_LABEL, GAME_STATE_TEXT, MODE_LABEL, NO_GAME_MESSAGE, NO_MODE, NO_RUN_MESSAGE, PANEL_MIN_WIDTH, SEED_LABEL, STATUS_LABEL,
} from './RunView.constants';

const RunView = () => {
  const game = useRandomizerGame();
  const labels = useRandomizerLabels();
  const { session, status, summary, gameRunning } = useRandomizerSession();
  if (!game) return <EmptyState message={NO_GAME_MESSAGE} />;
  const panels = game.views?.runPanels ?? [];

  return (
    <Grid minColWidth={PANEL_MIN_WIDTH} gap="lg" dense>
      <Card title={labels.run}>
        <Stack gap="sm">
          <StatRow label={STATUS_LABEL} value={status} />
          <StatRow label={MODE_LABEL} value={session?.kind ?? NO_MODE} />
          <StatRow label={GAME_LABEL} value={gameRunning ? GAME_STATE_TEXT.running : GAME_STATE_TEXT.stopped} />
          {summary ? <StatRow label={SEED_LABEL} value={summary.seed} mono /> : <EmptyState message={NO_RUN_MESSAGE} size="sm" />}
        </Stack>
      </Card>
      {panels.map((Panel, index) => <Panel key={index} />)}
    </Grid>
  );
};

export { RunView };
