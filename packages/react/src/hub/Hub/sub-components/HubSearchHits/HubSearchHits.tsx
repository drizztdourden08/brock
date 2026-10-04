/* @layer renderer-shell @kind component */
import { useMemo } from 'react';
import type { SearchResultsHit } from '@drizztdourden08/tessera/composites';
import type { HubSearchHitsProps } from './HubSearchHits.type';
import { BrandSearchResults } from '../../../../search/BrandSearchResults';

const HubSearchHits = (props: HubSearchHitsProps) => {
  const { query, index, onOpen } = props;
  const needle = query.trim();
  const hits = useMemo(() => (needle === '' ? [] : index(needle)), [index, needle]);

  const openHit = (picked: SearchResultsHit) => {
    const hit = hits.find((candidate) => candidate.id === picked.id);
    if (hit) onOpen(hit);
  };

  return <BrandSearchResults query={query} count={hits.length} hits={hits} onOpenHit={openHit} idleMessage="Type to search this hub." />;
};

export { HubSearchHits };
