/* @layer renderer-shell @kind logic */
import type { SearchEntry, SearchTarget } from './search.type';

const targetKey = (target: SearchTarget): string => `${target.route}#${target.anchor ?? ''}?${JSON.stringify(target.params ?? {})}`;

const uniqueByTarget = (entries: readonly SearchEntry[]): SearchEntry[] => {
  const seen = new Set<string>();
  return entries.filter((entry) => {
    if (entry.target === undefined || entry.kind === 'entry') return true;
    const key = targetKey(entry.target);
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
};

export { uniqueByTarget };
