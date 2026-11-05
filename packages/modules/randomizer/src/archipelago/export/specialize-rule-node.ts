/* @layer core @kind logic */
import { itemAt } from '@drizztdourden08/brock-core/util';
import { exportExpansionOf } from './export-expansion-of';
import { PASS_THROUGH_OPS, RULE_FALSE, RULE_TRUE } from './specialize-node.constants';
import type { Again, IfNode, PassThroughNode, ReadingNode } from './specialize-node.type';
import type { Readings } from './export.type';
import type { CallInput } from './specialize-rule-node.type';
import type {
  HelperNode, HelperRegistry, RuleArg, RuleCount, RuleNode, World, WorldKeys,
} from '../../world';

const valueOf = <K extends WorldKeys>(readings: Readings, ref: RuleArg<K> | RuleCount<K>): string | number | boolean => {
  if (typeof ref !== 'object') return ref;
  return 'seed' in ref ? readings.seed(ref.seed) : readings.option(ref.option);
};

const join = <K extends WorldKeys>(op: 'all' | 'any', parts: readonly RuleNode<K>[]): RuleNode<K> => {
  const absorbing = op === 'all' ? 'false' : 'true';
  if (parts.some((part) => part.op === absorbing)) return op === 'all' ? RULE_FALSE : RULE_TRUE;
  const kept = parts.filter((part) => part.op !== (op === 'all' ? 'true' : 'false'));
  if (kept.length === 0) return op === 'all' ? RULE_TRUE : RULE_FALSE;
  return kept.length === 1 ? itemAt(kept, 0) : { op, of: kept };
};

const isPassThrough = <K extends WorldKeys>(node: RuleNode<K>): node is PassThroughNode<K> =>
  PASS_THROUGH_OPS.has(node.op);

const specializeIf = <K extends WorldKeys>(node: IfNode<K>, again: Again<K>): RuleNode<K> => {
  const cond = again(node.cond);
  if (cond.op === 'true') return again(node.then);
  if (cond.op === 'false') return again(node.else);
  return { op: 'if', cond, then: again(node.then), else: again(node.else) };
};

const specializeCall = <K extends WorldKeys>(
  node: HelperNode<K>, world: World<K>, input: CallInput<K>, again: Again<K>,
): RuleNode<K> => {
  const args = (node.args ?? []).map((arg) => valueOf(input.readings, arg));
  const plain = { ...node, args };
  const expansion = exportExpansionOf(plain, world, input.helpers);
  return expansion === undefined ? plain : again(expansion);
};

const specializeReading = <K extends WorldKeys>(node: ReadingNode<K>, readings: Readings): RuleNode<K> => {
  switch (node.op) {
    case 'option': return readings.option(node.key) === node.equals ? RULE_TRUE : RULE_FALSE;
    case 'seed': return readings.seed(node.key) === node.equals ? RULE_TRUE : RULE_FALSE;
    case 'has': return typeof node.item === 'object'
      ? { ...node, item: String(valueOf(readings, node.item)) as K['holding'] }
      : node;
    case 'hasDistinct':
    case 'countGroup': return { ...node, atLeast: Number(valueOf(readings, node.atLeast)) };
  }
};

const specializeRuleNode = <K extends WorldKeys>(
  node: RuleNode<K>, world: World<K>, readings: Readings, helpers: HelperRegistry<World<K>>,
): RuleNode<K> => {
  const again: Again<K> = (child) => specializeRuleNode(child, world, readings, helpers);
  if (isPassThrough(node)) return node;
  if (node.op === 'all' || node.op === 'any') return join(node.op, node.of.map(again));
  if (node.op === 'if') return specializeIf(node, again);
  if (node.op === 'helper') return specializeCall(node, world, { readings, helpers }, again);
  return specializeReading(node, readings);
};

export { specializeRuleNode };
