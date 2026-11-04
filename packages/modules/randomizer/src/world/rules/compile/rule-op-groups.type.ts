/* @layer core @kind types */
import type { RuleNode } from '../../types/rule-node.type';
import type { WorldKeys } from '../../types/world-keys.type';

type HoldingOp = 'has' | 'hasAny' | 'hasDistinct' | 'countGroup';

type CombinatorOp = 'all' | 'any' | 'if';

type WorldQueryOp = 'region' | 'location' | 'exit' | 'placedAt' | 'option' | 'seed';

type HoldingNode<K extends WorldKeys = WorldKeys> = Extract<RuleNode<K>, { op: HoldingOp }>;

type CombinatorNode<K extends WorldKeys = WorldKeys> = Extract<RuleNode<K>, { op: CombinatorOp }>;

type WorldQueryNode<K extends WorldKeys = WorldKeys> = Extract<RuleNode<K>, { op: WorldQueryOp }>;

type ConstantNode<K extends WorldKeys = WorldKeys> = Extract<RuleNode<K>, { op: 'true' | 'false' }>;

export type { CombinatorNode, CombinatorOp, ConstantNode, HoldingNode, HoldingOp, WorldQueryNode, WorldQueryOp };
