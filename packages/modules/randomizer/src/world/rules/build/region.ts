/* @layer core @kind logic */
import type { RuleNode } from '../../types/rule-node.type';
import type { WorldKeys } from '../../types/world-keys.type';

const region = <K extends WorldKeys>(id: K['region']): RuleNode<K> => ({ op: 'region', region: id });

export { region };
