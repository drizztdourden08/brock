/* @layer core @kind logic */
import { any } from '../build';
import { compileRule } from '../compile';
import { NO_HELPERS } from '../no-helpers.constants';
import type { Rule } from '../../types/rule.type';
import type { RuleNode } from '../../types/rule-node.type';
import type { WorldKeys } from '../../types/world-keys.type';

const placedIn = <K extends WorldKeys>(item: K['item'], locations: readonly K['location'][]): Rule<K> =>
  compileRule<K>(
    any(...locations.map((location): RuleNode<K> => ({ op: 'placedAt', location, item }))),
    NO_HELPERS,
  );

export { placedIn };
