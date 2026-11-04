/* @layer renderer-shell @kind component */
import { Card, EmptyState, Stack, StatRow } from '@drizztdourden08/tessera/primitives';
import { useRandomizerGame } from '../../game-registry/use-randomizer-game';
import { useRandomizerLabels } from '../../hooks/use-randomizer-labels';
import { useRandomizerSession } from '../../hooks/use-randomizer-session';
import { NO_GAME_MESSAGE, NO_OPTIONS_MESSAGE } from './OptionsView.constants';

const OptionsView = () => {
  const game = useRandomizerGame();
  const labels = useRandomizerLabels();
  const { summary } = useRandomizerSession();
  if (!game) return <EmptyState message={NO_GAME_MESSAGE} />;
  const Options = game.views?.Options;
  if (Options) return <Options />;

  return (
    <Card title={labels.options}>
      {summary && summary.rows.length > 0 ? (
        <Stack gap="sm">
          {summary.rows.map((row) => <StatRow key={row.label} label={row.label} value={row.value} />)}
        </Stack>
      ) : <EmptyState message={NO_OPTIONS_MESSAGE} size="sm" />}
    </Card>
  );
};

export { OptionsView };
