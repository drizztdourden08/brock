/* @layer core @kind types */
import type { RuleNode } from './rule-node.type';
import type { WorldKeys } from './world-keys.type';

type HelperNode<K extends WorldKeys = WorldKeys> = Extract<RuleNode<K>, { op: 'helper' }>;

export type { HelperNode };
