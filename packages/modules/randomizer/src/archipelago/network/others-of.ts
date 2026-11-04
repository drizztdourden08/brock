/* @layer core @kind logic */
import type { NetworkFacts } from './network-facts.type';
import type { RosterName } from './players-reply.type';

const othersOf = (facts: NetworkFacts): RosterName[] => facts.players
  .filter((player) => player.team === (facts.team ?? 0) && player.slot !== facts.slot)
  .map(({ slot, name }) => ({ slot, name }));

export { othersOf };
