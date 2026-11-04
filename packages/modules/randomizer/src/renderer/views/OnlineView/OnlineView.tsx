/* @layer renderer-shell @kind component */
import { Card, EmptyState, Stack, Toggle } from '@drizztdourden08/tessera/primitives';
import { useRandomizerGame } from '../../game-registry/behavior/useRandomizerGame';
import { useOnlineConnection } from '../../online/hooks/behavior/useOnlineConnection';
import {
  DEATH_LINK_DESCRIPTION, DEATH_LINK_LABEL, NO_GAME_MESSAGE, ONLINE_TITLE, TRACK_DESCRIPTION, TRACK_LABEL,
} from './OnlineView.constants';

const OnlineView = () => {
  const game = useRandomizerGame();
  const { connection, patch } = useOnlineConnection();
  if (!game) return <EmptyState message={NO_GAME_MESSAGE} />;
  const GameOnline = game.views?.Online;

  return (
    <Stack gap="md">
      <Card title={ONLINE_TITLE}>
        <Stack gap="sm">
          <Toggle
            label={DEATH_LINK_LABEL}
            description={DEATH_LINK_DESCRIPTION}
            checked={connection.deathLink === true}
            onChange={(deathLink) => void patch({ deathLink })}
          />
          <Toggle
            label={TRACK_LABEL}
            description={TRACK_DESCRIPTION}
            checked={connection.trackOtherPlayers === true}
            onChange={(trackOtherPlayers) => void patch({ trackOtherPlayers })}
          />
        </Stack>
      </Card>
      {GameOnline ? <GameOnline /> : null}
    </Stack>
  );
};

export { OnlineView };
