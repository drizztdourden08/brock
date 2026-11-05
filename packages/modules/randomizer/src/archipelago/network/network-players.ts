/* @layer core @kind logic */
import type { NetworkPlayer } from './network-status.type';
import type { NetworkStatusInput } from './network-status-input.type';

const buildNetworkPlayers = (input: NetworkStatusInput): NetworkPlayer[] => {
  const { facts, presence, trackers } = input;
  const team = facts.team ?? 0;
  return facts.players
    .filter((player) => player.team === team)
    .map((player) => {
      const online = player.slot === facts.slot ? facts.connection === 'connected' : presence.onlineOf(player.slot);
      const status = presence.statusOf(player.slot);
      const progress = trackers.progressOf(player.slot);
      return {
        slot: player.slot,
        team: player.team,
        name: player.name,
        game: facts.games.get(player.slot) ?? '',
        status: online !== true && status !== 'goal' ? 'unknown' : status,
        online,
        checked: progress?.checked ?? null,
        total: progress?.total ?? null,
      };
    })
    .sort((a, b) => a.slot - b.slot);
};

export { buildNetworkPlayers };
