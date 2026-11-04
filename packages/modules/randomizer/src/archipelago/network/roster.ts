/* @layer core @kind logic */
import { applyRosterStatus } from './apply-roster-status';
import { clientStatusKey } from './client-status-key';
import { isPlayersReply } from './is-players-reply';
import { othersOf } from './others-of';
import { rosterOfReply } from './players-reply';
import { printText } from './print-text';
import { PLAYERS_COMMAND, SETTLE_AFTER_MS } from './roster.constants';
import type { Roster, RosterDeps } from './roster.type';

const createRoster = (deps: RosterDeps): Roster => {
  const { facts, presence, send, isLinked, onSettled } = deps;
  let queried = false;
  let settled = false;
  let timer: ReturnType<typeof setTimeout> | null = null;

  const settle = (): void => {
    if (settled || !queried) return;
    settled = true;
    if (timer !== null) clearTimeout(timer);
    timer = null;
    onSettled();
  };

  const applyReply = (text: string): void => {
    for (const [slot, online] of rosterOfReply(text, facts.team ?? 0, othersOf(facts))) {
      if (!isLinked(slot)) presence.setOnline(slot, online);
    }
    settle();
  };

  const query = (): void => {
    if (queried || facts.team === null) return;
    queried = true;
    const team = facts.team;
    const keys = facts.players.filter((player) => player.team === team).map(({ slot }) => clientStatusKey(team, slot));
    if (keys.length > 0) {
      send({ cmd: 'Get', keys });
      send({ cmd: 'SetNotify', keys });
    }
    if (othersOf(facts).length === 0) {
      settle();
      return;
    }
    send({ cmd: 'Say', text: PLAYERS_COMMAND });
    timer = setTimeout(settle, SETTLE_AFTER_MS);
  };

  const received: Roster['received'] = (packet) => {
    if (packet.cmd === 'Retrieved') {
      let moved = false;
      for (const [key, value] of Object.entries(packet.keys ?? {})) moved = applyRosterStatus(deps, key, value, true) || moved;
      return moved;
    }
    if (packet.cmd === 'SetReply') return applyRosterStatus(deps, packet.key, packet.value, false);
    if (packet.cmd === 'PrintJSON' && packet.type === 'CommandResult' && isPlayersReply(printText(packet))) {
      applyReply(printText(packet));
      return true;
    }
    return false;
  };

  const reset = (): void => {
    if (timer !== null) clearTimeout(timer);
    timer = null;
    queried = false;
    settled = false;
  };

  return { query, received, reset };
};

export { createRoster };
