/* @layer core @kind logic */
import { walkRuleNode } from '../../world';
import { callKey } from './call-key';
import { exportExpansionOf } from './export-expansion-of';
import type { ExportedHelperCall } from './export.type';
import type { HelperRegistry, KeysOf, RuleNode, World } from '../../world';

const helperCallsOf = <W extends World>(
  world: W, roots: Iterable<RuleNode<KeysOf<W>>>, helpers: HelperRegistry<W>,
): ExportedHelperCall[] => {
  const calls = new Map<string, ExportedHelperCall>();
  const visit = (root: RuleNode<KeysOf<W>>): void => walkRuleNode(root, (node) => {
    if (node.op !== 'helper') return;
    const key = callKey(node);
    if (calls.has(key)) return;
    const expansion = exportExpansionOf<KeysOf<W>>(node, world, helpers);
    if (expansion === undefined) return;
    calls.set(key, { name: node.name, args: (node.args ?? []) as ExportedHelperCall['args'], rule: expansion });
    visit(expansion);
  });
  for (const root of roots) visit(root);
  return [...calls.values()].sort((a, b) => (a.name + JSON.stringify(a.args)).localeCompare(b.name + JSON.stringify(b.args)));
};

export { helperCallsOf };
