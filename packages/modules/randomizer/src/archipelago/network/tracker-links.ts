/* @layer core @kind logic */
import { createTrackerLink } from './tracker-link';
import type { TrackerLink } from './tracker-link.type';
import type { TrackerLinks, TrackerLinksDeps } from './tracker-links.type';

const createTrackerLinks = (deps: TrackerLinksDeps): TrackerLinks => {
  const { facts, createSocket, connection, url, uuid, onChange } = deps;
  const links = new Map<number, TrackerLink>();

  return {
    open() {
      const config = connection();
      const address = url();
      if (config === null || config.trackOtherPlayers === false || address === null || facts.team === null) return;
      for (const player of facts.players) {
        if (player.team !== facts.team || player.slot === facts.slot || links.has(player.slot)) continue;
        links.set(player.slot, createTrackerLink({
          url: address,
          name: player.name,
          password: config.password,
          uuid: `${uuid()}-tracker-${player.slot}`,
          createSocket,
          onChange,
        }));
      }
    },
    closeAll() {
      for (const link of links.values()) link.close();
      links.clear();
    },
    progressOf: (slot) => links.get(slot)?.progress ?? null,
    isLinked: (slot) => links.get(slot)?.linked === true,
    get size() { return links.size; },
  };
};

export { createTrackerLinks };
