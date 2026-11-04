/* @layer core @kind logic */
import { canCollectLocation } from '../../state';
import { readSeedValue } from '../read-seed-value';
import type { RuleCheck } from '../../types/rule-check.type';
import type { World } from '../../types/world.type';
import type { WorldKeys } from '../../types/world-keys.type';
import type { WorldQueryNode } from './rule-op-groups.type';

const compileWorldQuery = <K extends WorldKeys>(node: WorldQueryNode<K>): RuleCheck<World<K>> => {
  switch (node.op) {
    case 'region': {
      const { region } = node;
      return (state) => state.canReachRegion(region);
    }
    case 'location': {
      const { location } = node;
      return (state) => canCollectLocation(state, location);
    }
    case 'exit': {
      const { name } = node;
      return (state) => {
        const rule = state.world.getRule(name);
        return rule === undefined || rule(state);
      };
    }
    case 'placedAt': {
      const { location, item } = node;
      return (state) => state.world.placedItems.get(location) === item;
    }
    case 'option': {
      const { key, equals } = node;
      return (state) => state.world.readOption(key) === equals;
    }
    case 'seed': {
      const { key, equals } = node;
      return (state) => readSeedValue(state.world, key) === equals;
    }
  }
};

export { compileWorldQuery };
