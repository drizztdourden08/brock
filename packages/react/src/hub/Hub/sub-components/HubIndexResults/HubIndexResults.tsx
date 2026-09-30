/* @layer renderer-shell @kind component */
import { useMemo } from 'react';
import { SearchResults } from '@drizztdourden08/tessera/composites';
import type { SearchResultsHit } from '@drizztdourden08/tessera/composites';
import { uniqueById } from '../../../../collections/unique-by-id';
import { entriesInBucket } from '../../../../search/entries-in-bucket';
import { rankEntries } from '../../../../search/rank-entries';
import { uniqueByTarget } from '../../../../search/unique-by-target';
import { useSearchIndex } from '../../../../search/useSearchIndex';
import { NO_ACTIONS, NO_MENU } from '../../../hub.constants';
import { hubPageEntries } from '../../behavior/hub-page-entries';
import { hubResultGroups } from '../../behavior/hub-result-groups';
import type { HubIndexResultsProps } from './HubIndexResults.type';

const HubIndexResults = (props: HubIndexResultsProps) => {
  const { def, pages, query, onOpen, onOpenPage } = props;
  const needle = query.trim();
  const catalog = useSearchIndex(needle !== '', NO_MENU, NO_ACTIONS);
  const ranked = useMemo(() => {
    if (needle === '') return [];
    const own = uniqueByTarget(uniqueById([...entriesInBucket(catalog, def.id), ...hubPageEntries(def, pages)]));
    return rankEntries(own, needle);
  }, [catalog, def, pages, needle]);
  const groups = useMemo(() => hubResultGroups(def, pages, ranked), [def, pages, ranked]);
  const count = groups.reduce((sum, group) => sum + (group.count ?? 0), 0);

  const openHit = (hit: SearchResultsHit) => {
    const entry = ranked.find((candidate) => candidate.id === hit.id);
    if (entry) onOpen(entry);
  };

  return (
    <SearchResults
      query={query}
      count={count}
      groups={groups}
      onOpenHit={openHit}
      onOpenGroup={onOpenPage}
      idleMessage={`Type to search ${def.title}.`}
      emptyMessage={`Nothing in ${def.title} matches "${needle}".`}
    />
  );
};

export { HubIndexResults };
