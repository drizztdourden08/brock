/* @layer core @kind logic */
import type { NetworkPlayer } from './network-status.type';
import type { NetworkStatusInput } from './network-status-input.type';

const buildNetworkPlayers = (input: NetworkStatusInput): NetworkPlayer[] => {
  const { facts, presence } = input;
  const team = facts.team ?? 0;
  return facts.players
    .filter((player) => player.team === team)
    .map((player) => {
      const online = player.slot === facts.slot ? facts.connection === 'connected' : presence.onlineOf(player.slot) === true;
      const status = presence.statusOf(player.slot);
      return {
        slot: player.slot,
        team: player.team,
        name: player.name,
        game: facts.games.get(player.slot) ?? '',
        status: !online && status !== 'goal' ? 'unknown' : status,
        online,
      };
    })
    .sort((a, b) => a.slot - b.slot);
};

export { buildNetworkPlayers };
