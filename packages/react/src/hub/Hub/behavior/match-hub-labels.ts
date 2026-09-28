/* @layer renderer-shell @kind logic */
import type { HubPage, HubSearchHit } from '../../hub.type';

const tabHits = (page: HubPage, needle: string): HubSearchHit[] =>
  (page.tabs ?? [])
    .filter((tab) => tab.label.toLowerCase().includes(needle))
    .map((tab) => ({ id: `${page.id}/${tab.id}`, label: tab.label, detail: page.label, section: page.id, tab: tab.id }));

const matchHubLabels = (pages: readonly HubPage[], query: string): HubSearchHit[] => {
  const needle = query.trim().toLowerCase();
  if (needle === '') return [];
  return pages.flatMap((page) => {
    const own = page.label.toLowerCase().includes(needle) ? [{ id: page.id, label: page.label, section: page.id }] : [];
    return [...own, ...tabHits(page, needle)];
  });
};

export { matchHubLabels };
