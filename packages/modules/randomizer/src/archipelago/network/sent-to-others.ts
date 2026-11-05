/* @layer core @kind logic */
import type { NetworkFacts } from './network-facts.type';

const sentToOthers = (facts: NetworkFacts): number => {
  let count = 0;
  for (const id of facts.sentChecks) {
    const owner = facts.scoutOwners.get(id);
    if (owner !== undefined && owner !== facts.slot) count += 1;
  }
  return count;
};

export { sentToOthers };
