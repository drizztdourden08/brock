/* @layer renderer-shell @kind component */
import { useText } from '@drizztdourden08/brock-react';
import { Stack, Text } from '@drizztdourden08/tessera/primitives';
import { useNetworkStatus } from '../../../../online/hooks/behavior/useNetworkStatus';
import { DashboardCard } from '../../../dashboard/DashboardCard';
import { PlayerRow } from '../../../dashboard/PlayerRow';
import { playersSummaryOf } from '../../behavior/players-summary';
import { RUN_SPANS } from '../../RunView.constants';
import { EMPTY, PLAYERS_TITLE, WAITING } from './RunPlayers.constants';

const RunPlayers = () => {
  const text = useText();
  const players = useNetworkStatus()?.players ?? null;
  if (players === null || players.length === 0) {
    return (
      <DashboardCard span={RUN_SPANS.players} title={text(PLAYERS_TITLE)}>
        <Text variant="caption">{players === null ? text(WAITING) : text(EMPTY)}</Text>
      </DashboardCard>
    );
  }

  return (
    <DashboardCard span={RUN_SPANS.players} title={text(PLAYERS_TITLE)} subtitle={playersSummaryOf(players, text)}>
      <Stack gap="sm">
        {players.map((player) => (
          <PlayerRow key={`${player.team}-${player.slot}`} player={player} />
        ))}
      </Stack>
    </DashboardCard>
  );
};

export { RunPlayers };
