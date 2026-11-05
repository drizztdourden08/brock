/* @layer renderer-shell @kind component */
import { useProfilesStore } from '@drizztdourden08/brock-react';
import { Card, EmptyState, Stack, StatRow } from '@drizztdourden08/tessera/primitives';
import { useRandomizerGame } from '../../game-registry/behavior/useRandomizerGame';
import { useRandomizerLabels } from '../../hooks/behavior/useRandomizerLabels';
import { useRandomizerSession } from '../../hooks/behavior/useRandomizerSession';
import { OptionsPanel } from '../../options/OptionsPanel';
import { NO_GAME_MESSAGE, NO_OPTIONS_MESSAGE } from './OptionsView.constants';

const OptionsView = () => {
  const game = useRandomizerGame();
  const labels = useRandomizerLabels();
  const { summary } = useRandomizerSession();
  const config = useProfilesStore((state) => state.active?.randomizer);
  if (!game) return <EmptyState message={NO_GAME_MESSAGE} />;
  const Options = game.views?.Options;
  if (Options) return <Options />;
  if (config && (game.catalog ?? []).length > 0) {
    return <OptionsPanel title={labels.options} overrides={Object.fromEntries(Object.entries(config.options))} seed={config.seed} />;
  }

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
