/* @layer core @kind types */
import type { RuleNode } from './rule-node.type';
import type { WorldKeys } from './world-keys.type';

type RuleNodeVisitor<K extends WorldKeys = WorldKeys> = (node: RuleNode<K>, depth: number) => void;

export type { RuleNodeVisitor };
