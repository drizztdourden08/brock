/* @layer core @kind constants */
import type { RuleNode } from '../../world';
import type { PassThroughOp } from './specialize-node.type';

const RULE_TRUE: { op: 'true' } = { op: 'true' };

const RULE_FALSE: { op: 'false' } = { op: 'false' };

const PASS_THROUGH_OPS: ReadonlySet<RuleNode['op']> = new Set<PassThroughOp>([
  'true', 'false', 'hasAny', 'region', 'location', 'exit', 'placedAt',
]);

export { PASS_THROUGH_OPS, RULE_FALSE, RULE_TRUE };
