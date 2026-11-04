/* @layer core @kind logic */
import { DEATH_LINK_GUARD_MS } from './death-link.constants';
import type { DeathLinkGuard } from './death-link-guard.type';

const createDeathLinkGuard = (now: () => number): DeathLinkGuard => {
  let lastSentAt = Number.NEGATIVE_INFINITY;
  let lastKilledAt = Number.NEGATIVE_INFINITY;
  const within = (at: number): boolean => now() - at < DEATH_LINK_GUARD_MS;
  return {
    markSent() {
      lastSentAt = now();
      return lastSentAt;
    },
    markKilled() {
      lastKilledAt = now();
    },
    sentRecently: () => within(lastSentAt),
    killedRecently: () => within(lastKilledAt),
  };
};

export { createDeathLinkGuard };
