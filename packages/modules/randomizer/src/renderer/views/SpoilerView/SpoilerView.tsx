/* @layer renderer-shell @kind component */
import { Card, EmptyState, Stack, StatRow } from '@drizztdourden08/tessera/primitives';
import { useRandomizerGame } from '../../game-registry/use-randomizer-game';
import { useRandomizerLabels } from '../../hooks/use-randomizer-labels';
import { useRandomizerSession } from '../../hooks/use-randomizer-session';
import { NO_GAME_MESSAGE, NO_PLACEMENT_MESSAGE } from './SpoilerView.constants';

const SpoilerView = () => {
  const game = useRandomizerGame();
  const labels = useRandomizerLabels();
  const { summary } = useRandomizerSession();
  if (!game) return <EmptyState message={NO_GAME_MESSAGE} />;
  const Spoiler = game.views?.Spoiler;
  if (Spoiler) return <Spoiler />;
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
