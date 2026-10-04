/* @layer renderer-shell @kind component */
import { useMemo } from 'react';
import type { SearchResultsHit } from '@drizztdourden08/tessera/composites';
import { useBrock } from '../../../../app/useBrock';
import { uniqueById } from '../../../../collections/unique-by-id';
import { entriesInBucket } from '../../../../search/entries-in-bucket';
import { rankEntries } from '../../../../search/rank-entries';
import { uniqueByTarget } from '../../../../search/unique-by-target';
import { useSearchIndex } from '../../../../search/useSearchIndex';
import { useSettings } from '../../../../stores/useSettings';
import { NO_ACTIONS, NO_MENU } from '../../../hub.constants';
import { hubLiveGroups } from '../../behavior/hub-live-groups';
import { hubPageEntries } from '../../behavior/hub-page-entries';
import { hubResultGroups } from '../../behavior/hub-result-groups';
import type { HubIndexResultsProps } from './HubIndexResults.type';
import { BrandSearchResults } from '../../../../search/BrandSearchResults';

const HubIndexResults = (props: HubIndexResultsProps) => {
  const { def, pages, query, onOpen, onOpenPage } = props;
  const { tabs, settingsControls } = useBrock();
  const { settings, patch } = useSettings<object>();
  const needle = query.trim();
  const normalized = needle.toLowerCase();
  const catalog = useSearchIndex(needle !== '', NO_MENU, NO_ACTIONS);
  const ranked = useMemo(() => {
    if (needle === '') return [];
    const own = uniqueByTarget(uniqueById([...entriesInBucket(catalog, def.id), ...hubPageEntries(def, pages)]));
    return rankEntries(own, needle);
  }, [catalog, def, pages, needle]);
  const groups = useMemo(() => {
    if (needle === '') return [];
    const live = hubLiveGroups(pages, tabs, normalized, { settings, onChange: patch, ...settingsControls });
    const linked = hubResultGroups(def, pages.filter((page) => page.settingsTab === undefined), ranked);
    const order = (id: string): number => pages.findIndex((page) => page.id === id);
    return [...live, ...linked].sort((a, b) => order(a.id) - order(b.id));
  }, [def, pages, tabs, normalized, needle, settings, patch, settingsControls, ranked]);
  const jumps = useMemo(() => (needle === '' ? [] : pages
    .filter((page) => page.label.toLowerCase().includes(normalized))
    .map((page) => ({ id: page.id, label: page.label, icon: page.icon }))), [pages, needle, normalized]);
  const count = groups.reduce((sum, group) => sum + (group.count ?? 0), 0);

  const openHit = (hit: SearchResultsHit) => {
    const entry = ranked.find((candidate) => candidate.id === hit.id);
    if (entry) onOpen(entry);
  };

  return (
    <BrandSearchResults
      query={query}
      count={count}
      jumps={jumps}
      onJump={onOpenPage}
      groups={groups}
      onOpenHit={openHit}
      onOpenGroup={onOpenPage}
      idleMessage={`Type to search ${def.title}.`}
      emptyMessage={`Nothing in ${def.title} matches "${needle}".`}
    />
  );
};

export { HubIndexResults };
