/* @layer renderer-shell @kind logic */
import type { NetworkPlayer } from '../../../../archipelago';

const playersSummaryOf = (players: readonly NetworkPlayer[]): string => {
  const online = players.filter((player) => player.online).length;
  const finished = players.filter((player) => player.status === 'goal').length;
  const parts = [`${online} of ${players.length} online`];
  if (finished > 0) parts.push(`${finished} completed their goal`);
  return parts.join(', ');
};

export { playersSummaryOf };
