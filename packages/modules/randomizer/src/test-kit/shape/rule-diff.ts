/* @layer core @kind logic */
import type { Rule, WorldKeys } from '../../world/types';

const nodeText = <K extends WorldKeys>(rule: Rule<K> | undefined): string | undefined => JSON.stringify(rule?.node);

const ruleDiff = <N, K extends WorldKeys>(wide: ReadonlyMap<N, Rule<K>>, profile: ReadonlyMap<N, Rule<K>>): string[] =>
  [...profile]
    .filter(([name, rule]) => nodeText(wide.get(name)) !== nodeText(rule))
    .map(([name]) => String(name));

export { ruleDiff };
