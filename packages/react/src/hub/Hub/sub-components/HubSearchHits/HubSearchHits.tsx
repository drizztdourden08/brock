/* @layer renderer-shell @kind component */
import { useMemo } from 'react';
import { Box, Button, EmptyState, Text } from '@drizztdourden08/tessera/primitives';
import type { HubSearchHitsProps } from './HubSearchHits.type';

const HubSearchHits = (props: HubSearchHitsProps) => {
  const { query, index, onOpen } = props;
  const needle = query.trim();
  const hits = useMemo(() => (needle === '' ? [] : index(needle)), [index, needle]);

  if (needle === '') return <EmptyState className="hub-screen__empty" message="Type to search this hub." />;
  if (hits.length === 0) return <EmptyState className="hub-screen__empty" message={`Nothing matches "${needle}".`} />;

  return (
    <Box className="hub-hits">
      <Text className="hub-hits__count">
        {hits.length} {hits.length === 1 ? 'result' : 'results'} for &quot;{needle}&quot;
      </Text>
      <Box className="hub-hits__list">
        {hits.map((hit) => (
          <Button key={hit.id} className="hub-hits__item" variant="ghost" onClick={() => onOpen(hit)}>
            {hit.label}
            {hit.detail && <Text as="span" className="hub-hits__detail">{hit.detail}</Text>}
          </Button>
        ))}
      </Box>
    </Box>
  );
};

export { HubSearchHits };
