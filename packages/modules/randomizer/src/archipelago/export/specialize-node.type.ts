/* @layer core @kind types */
import type { RuleNode, WorldKeys } from '../../world';

type PassThroughOp = 'true' | 'false' | 'hasAny' | 'region' | 'location' | 'exit' | 'placedAt';

type PassThroughNode<K extends WorldKeys> = Extract<RuleNode<K>, { op: PassThroughOp }>;

type IfNode<K extends WorldKeys> = Extract<RuleNode<K>, { op: 'if' }>;

type ReadingNode<K extends WorldKeys> =
  Exclude<RuleNode<K>, PassThroughNode<K> | IfNode<K> | { op: 'all' | 'any' | 'helper' }>;

type Again<K extends WorldKeys> = (child: RuleNode<K>) => RuleNode<K>;

export type { Again, IfNode, PassThroughNode, PassThroughOp, ReadingNode };
