/* @layer core @kind logic */
import { isNonGameClient } from './is-non-game-client';
import { playerStatusOf } from './player-status-of';
import type { PlayerStatus } from './player-status.type';
import type { Presence } from './presence.type';
import { statusImpliesOnline } from './status-implies-online';

const createPresence = (): Presence => {
  const counts = new Map<number, number>();
  const statuses = new Map<number, PlayerStatus>();

  return {
    onlineOf(slot) {
      const count = counts.get(slot);
      return count === undefined ? null : count > 0;
    },
    statusOf: (slot) => statuses.get(slot) ?? 'unknown',
    handlePrint(packet, team) {
      if (packet.type !== 'Join' && packet.type !== 'Part') return false;
      if (typeof packet.slot !== 'number') return false;
      if (team !== null && typeof packet.team === 'number' && packet.team !== team) return false;
      if (isNonGameClient(packet)) return false;
      const count = counts.get(packet.slot) ?? 0;
      counts.set(packet.slot, Math.max(0, count + (packet.type === 'Join' ? 1 : -1)));
      return true;
    },
    setOnline(slot, online) {
      counts.set(slot, online ? Math.max(1, counts.get(slot) ?? 0) : 0);
    },
    setStatus(slot, value, seed) {
      const status = playerStatusOf(value);
      statuses.set(slot, status);
      const implied = statusImpliesOnline(status);
      const serverFilledKey = typeof value === 'number';
      if (seed && serverFilledKey && implied !== null && !counts.has(slot)) counts.set(slot, implied ? 1 : 0);
    },
    clear: () => {
      counts.clear();
      statuses.clear();
    },
  };
};

export { createPresence };
