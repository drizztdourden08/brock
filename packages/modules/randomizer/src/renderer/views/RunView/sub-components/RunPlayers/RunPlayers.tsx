/* @layer renderer-shell @kind component */
import { Stack, StatRow, Status, Text } from '@drizztdourden08/tessera/primitives';
import { useNetworkStatus } from '../../../../online/hooks/behavior/useNetworkStatus';
import { DashboardCard } from '../../../dashboard/DashboardCard';
import { playersSummaryOf } from '../../behavior/players-summary';
import { RUN_SPANS } from '../../RunView.constants';
import { EMPTY, PLAYERS_TITLE, WAITING } from './RunPlayers.constants';

const RunPlayers = () => {
  const players = useNetworkStatus()?.players ?? null;
  if (players === null || players.length === 0) {
    return (
      <DashboardCard span={RUN_SPANS.players} title={PLAYERS_TITLE}>
        <Text variant="caption">{players === null ? WAITING : EMPTY}</Text>
      </DashboardCard>
    );
  }

  return (
    <DashboardCard span={RUN_SPANS.players} title={PLAYERS_TITLE} subtitle={playersSummaryOf(players)}>
      <Stack gap="sm">
        {players.map((player) => (
          <StatRow
            key={`${player.team}-${player.slot}`}
            label={player.game === '' ? player.name : `${player.name} (${player.game})`}
            value={<Status tone={player.online ? 'success' : 'neutral'} dot>{player.status}</Status>}
          />
        ))}
      </Stack>
    </DashboardCard>
  );
};

export { RunPlayers };
