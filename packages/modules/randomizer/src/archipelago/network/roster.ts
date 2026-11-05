/* @layer core @kind logic */
import { applyRosterStatus } from './apply-roster-status';
import { clientStatusKey } from './client-status-key';
import type { Roster, RosterDeps } from './roster.type';

const createRoster = (deps: RosterDeps): Roster => {
  const { facts, send, onSettled } = deps;
  let queried = false;

  const query = (): void => {
    if (queried || facts.team === null) return;
    queried = true;
    const team = facts.team;
    const keys = facts.players.filter((player) => player.team === team).map(({ slot }) => clientStatusKey(team, slot));
    if (keys.length > 0) {
      send({ cmd: 'Get', keys });
      send({ cmd: 'SetNotify', keys });
    }
    onSettled();
  };

  const received: Roster['received'] = (packet) => {
    if (packet.cmd === 'Retrieved') {
      let moved = false;
      for (const [key, value] of Object.entries(packet.keys ?? {})) moved = applyRosterStatus(deps, key, value, true) || moved;
      return moved;
    }
    if (packet.cmd === 'SetReply') return applyRosterStatus(deps, packet.key, packet.value, false);
    return false;
  };

  const reset = (): void => {
    queried = false;
  };

  return { query, received, reset };
};

export { createRoster };
