/* @layer core @kind logic */
import { ruleArgOf } from './rule-arg-of';
import type { CollectionState } from '../../types/collection-state.type';
import type { RuleCheck } from '../../types/rule-check.type';
import type { RuleCount } from '../../types/rule-count.type';
import type { World } from '../../types/world.type';
import type { WorldKeys } from '../../types/world-keys.type';
import type { HoldingNode } from './rule-op-groups.type';

const countOf = <K extends WorldKeys>(state: CollectionState<World<K>>, count: RuleCount<K>): number =>
  (typeof count === 'number' ? count : Number(ruleArgOf(state, count)));

const compileHolding = <K extends WorldKeys>(node: HoldingNode<K>): RuleCheck<World<K>> => {
  switch (node.op) {
    case 'has': {
      const { item, count = 1 } = node;
      if (typeof item === 'object') return (state) => state.has(String(ruleArgOf(state, item)) as K['holding'], count);
      return (state) => state.has(item, count);
    }
    case 'hasAny': {
      const { items } = node;
      return (state) => state.hasAny(items);
    }
    case 'hasDistinct': {
      const { items, atLeast } = node;
      return (state) => items.filter((item) => state.has(item)).length >= countOf(state, atLeast);
    }
    case 'countGroup': {
      const { items, atLeast } = node;
      return (state) => state.countGroup(items) >= countOf(state, atLeast);
    }
  }
};

export { compileHolding };
