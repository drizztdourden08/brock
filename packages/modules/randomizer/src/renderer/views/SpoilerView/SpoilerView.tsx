/* @layer renderer-shell @kind component */
import { Card, EmptyState, Stack, StatRow } from '@drizztdourden08/tessera/primitives';
import { useRandomizerGame } from '../../game-registry/behavior/useRandomizerGame';
import { useRandomizerLabels } from '../../hooks/behavior/useRandomizerLabels';
import { useRandomizerSession } from '../../hooks/behavior/useRandomizerSession';
import { ChecksView } from '../ChecksView';
import { NO_GAME_MESSAGE, NO_PLACEMENT_MESSAGE, SPOILER_CHECKS_PREFS } from './SpoilerView.constants';

const SpoilerView = () => {
  const game = useRandomizerGame();
  const labels = useRandomizerLabels();
  const { summary } = useRandomizerSession();
  if (!game) return <EmptyState message={NO_GAME_MESSAGE} />;
  const Spoiler = game.views?.Spoiler;
  if (Spoiler) return <Spoiler />;
  if (game.tracker) return <ChecksView initial={SPOILER_CHECKS_PREFS} />;
  if (!summary) return <EmptyState message={NO_PLACEMENT_MESSAGE} />;

  return (
    <Card title={labels.spoiler}>
      <Stack gap="sm">
        {summary.rows.map((row) => <StatRow key={row.label} label={row.label} value={row.value} />)}
      </Stack>
    </Card>
  );
};

export { SpoilerView };
