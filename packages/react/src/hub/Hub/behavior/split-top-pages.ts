/* @layer renderer-shell @kind logic */
import type { HubGroup } from '../../hub.type';
import type { TopSplit } from './split-top-pages.type';

const splitTopPages = (groups: readonly HubGroup[], top: readonly string[] = []): TopSplit => {
  const all = groups.flatMap((group) => group.pages);
  const picked = [...new Set(top)].flatMap((id) => all.filter((page) => page.id === id));
  if (picked.length === 0) return { top: [], groups: [...groups] };
  const rest = groups.map((group) => ({ ...group, pages: group.pages.filter((page) => !picked.includes(page)) })).filter((group) => group.pages.length > 0);
  return { top: picked, groups: rest };
};

export { splitTopPages };
