/* @layer core @kind logic */
import type { RuleNode } from '../../types/rule-node.type';
import type { WorldKeys } from '../../types/world-keys.type';

const all = <K extends WorldKeys>(...of: readonly RuleNode<K>[]): RuleNode<K> => ({ op: 'all', of });

export { all };
