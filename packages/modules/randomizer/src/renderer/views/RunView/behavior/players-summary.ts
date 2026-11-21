/* @layer renderer-shell @kind logic */
import { msg, type Text } from '@drizztdourden08/brock-core/i18n';
import type { NetworkPlayer } from '../../../../archipelago';

const playersSummaryOf = (players: readonly NetworkPlayer[], text: (value: Text) => string): string => {
  const online = players.filter((player) => player.online).length;
  const finished = players.filter((player) => player.status === 'goal').length;
  const parts = [text(msg('randomizer:run.players.onlineOf', { online, total: players.length }))];
  if (finished > 0) parts.push(text(msg('randomizer:run.players.completed', { count: finished })));
  return parts.join(', ');
};

export { playersSummaryOf };
