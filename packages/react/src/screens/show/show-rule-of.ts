/* @layer renderer-shell @kind logic */
import type { ShowRule } from './show.type';

const showRuleOf = (source: ShowRule | undefined): ShowRule | undefined =>
  (source?.hosts === undefined && source?.when === undefined ? undefined : { hosts: source.hosts, when: source.when });

export { showRuleOf };
