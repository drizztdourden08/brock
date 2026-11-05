/* @layer core @kind logic */
import { walkRuleNode } from '../../world';
import { callKey } from './call-key';
import { exportExpansionOf } from './export-expansion-of';
import type { ExportedHelperCall } from './export.type';
import type { HelperRegistry, RuleNode, World, WorldKeys } from '../../world';

const helperCallsOf = <K extends WorldKeys>(
  world: World<K>, roots: Iterable<RuleNode<K>>, helpers: HelperRegistry<World<K>>,
): ExportedHelperCall[] => {
  const calls = new Map<string, ExportedHelperCall>();
  const visit = (root: RuleNode<K>): void => walkRuleNode(root, (node) => {
    if (node.op !== 'helper') return;
    const key = callKey(node);
    if (calls.has(key)) return;
    const expansion = exportExpansionOf(node, world, helpers);
    if (expansion === undefined) return;
    calls.set(key, { name: node.name, args: (node.args ?? []) as ExportedHelperCall['args'], rule: expansion });
    visit(expansion);
  });
  for (const root of roots) visit(root);
  return [...calls.values()].sort((a, b) => (a.name + JSON.stringify(a.args)).localeCompare(b.name + JSON.stringify(b.args)));
};

export { helperCallsOf };
