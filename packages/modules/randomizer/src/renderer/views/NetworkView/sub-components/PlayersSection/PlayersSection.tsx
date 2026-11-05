/* @layer renderer-shell @kind component */
import { Card, EmptyState, Stack, Toggle } from '@drizztdourden08/tessera/primitives';
import { useOnlineConnection } from '../../../../online/hooks/behavior/useOnlineConnection';
import { PlayerRow } from '../../../dashboard/PlayerRow';
import type { NetworkSectionProps } from '../../NetworkView.type';
import { NO_PLAYERS_MESSAGE, PLAYERS_TITLE, TRACK_DESCRIPTION, TRACK_LABEL } from './PlayersSection.constants';

const PlayersSection = ({ status }: NetworkSectionProps) => {
  const { connection, patch } = useOnlineConnection();

  return (
    <Card title={PLAYERS_TITLE}>
      <Stack gap="sm">
        {status.players.length === 0 ? <EmptyState message={NO_PLAYERS_MESSAGE} size="sm" /> : null}
        {status.players.map((player) => (
          <PlayerRow key={`${player.team}-${player.slot}`} player={player} />
        ))}
        <Toggle
          label={TRACK_LABEL}
          description={TRACK_DESCRIPTION}
          checked={connection.trackOtherPlayers === true}
          onChange={(trackOtherPlayers) => void patch({ trackOtherPlayers })}
        />
      </Stack>
    </Card>
  );
};

export { PlayersSection };
