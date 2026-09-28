/* @layer renderer-shell @kind component */
import { Box, Text } from '@drizztdourden08/tessera/primitives';
import { SearchResultRow } from './SearchResultRow';
import type { SearchResultListProps } from './SearchResultList.type';

const SearchResultList = (props: SearchResultListProps) => {
  const { items, idle, query, activeIndex, setActiveIndex, onSelect } = props;

  return (
    <Box className="search-palette__list" id="search-palette-results" role="listbox">
      {idle && items.length > 0 && <Text className="search-palette__list-heading">Screens</Text>}
      {!idle && items.length === 0 && <Text className="search-palette__empty">No results for &quot;{query}&quot;</Text>}
      {items.map((entry, index) => (
        <SearchResultRow
          key={entry.id}
          entry={entry}
          active={!idle && index === activeIndex}
          onHover={() => setActiveIndex(index)}
          onSelect={onSelect}
        />
      ))}
    </Box>
  );
};

export { SearchResultList };
