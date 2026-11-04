/* @layer core @kind logic */
import type { RuleCheck } from '../../types/rule-check.type';
import type { RuleNode } from '../../types/rule-node.type';
import type { World } from '../../types/world.type';
import type { WorldKeys } from '../../types/world-keys.type';
import type { CombinatorNode } from './rule-op-groups.type';

const compileCombinator = <K extends WorldKeys>(
  node: CombinatorNode<K>, compile: (child: RuleNode<K>) => RuleCheck<World<K>>,
): RuleCheck<World<K>> => {
  switch (node.op) {
    case 'all': {
      const children = node.of.map(compile);
      return (state) => children.every((child) => child(state));
    }
    case 'any': {
      const children = node.of.map(compile);
      return (state) => children.some((child) => child(state));
    }
    case 'if': {
      const cond = compile(node.cond);
      const whenTrue = compile(node.then);
      const whenFalse = compile(node.else);
      return (state) => (cond(state) ? whenTrue(state) : whenFalse(state));
    }
  }
};

export { compileCombinator };
