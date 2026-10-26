/* @layer renderer-shell @kind logic */
import { CONTEXT_MENU_SEPARATOR } from './context-menu.constants';
import type { ContextMenuContext, ContextMenuEntry, ZoneMatch } from './context-menu.type';
import { entriesOf } from './entries-of';

const included = (matches: readonly ZoneMatch[]): ZoneMatch[] => {
  const [first, ...rest] = matches;
  if (first === undefined) return [];
  const chain = [first];
  for (const match of rest) {
    if (chain[chain.length - 1]?.config.inherit !== 'parent') break;
    chain.push(match);
  }
  return chain;
};

const buildEntries = (matches: readonly ZoneMatch[], context: ContextMenuContext): ContextMenuEntry[] =>
  included(matches).flatMap((match, index): ContextMenuEntry[] => {
    const own = entriesOf(match.config, index === 0 ? context : { ...context, data: match.data });
    return index === 0 ? [...own] : [CONTEXT_MENU_SEPARATOR, ...own];
  });

export { buildEntries };
