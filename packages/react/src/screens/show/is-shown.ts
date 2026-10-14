/* @layer renderer-shell @kind logic */
import { currentShowContext } from './current-show-context';
import type { ShowContext, ShowRule } from './show.type';

const isShown = (rule: ShowRule | undefined, given?: ShowContext): boolean => {
  if (rule?.hosts === undefined && rule?.when === undefined) return true;
  const ctx = given ?? currentShowContext();
  if (rule.hosts !== undefined && !rule.hosts.includes(ctx.host)) return false;
  return rule.when?.(ctx) ?? true;
};

export { isShown };
