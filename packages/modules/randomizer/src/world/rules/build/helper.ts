/* @layer core @kind logic */
import type { RuleArg } from '../../types/rule-arg.type';
import type { RuleNode } from '../../types/rule-node.type';
import type { WorldKeys } from '../../types/world-keys.type';

const helper = <K extends WorldKeys>(name: K['helper'], ...args: readonly RuleArg<K>[]): RuleNode<K> =>
  (args.length === 0 ? { op: 'helper', name } : { op: 'helper', name, args });

export { helper };
