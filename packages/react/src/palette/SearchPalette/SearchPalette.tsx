/* @layer renderer-shell @kind component */
import { Box, Text } from '@drizztdourden08/tessera/primitives';
import { usePaletteShortcut } from './behavior/usePaletteShortcut';
import { useSearchPalette } from './behavior/useSearchPalette';
import { SearchInput } from './sub-components/SearchInput';
import { SearchResultList } from './sub-components/SearchResultList';
import { NO_ACTIONS } from './SearchPalette.constants';
import type { SearchPaletteProps } from './SearchPalette.type';
import './SearchPalette.css';

const SearchPalette = (props: SearchPaletteProps) => {
  const { menu, actions = NO_ACTIONS } = props;
  usePaletteShortcut();
  const model = useSearchPalette(menu, actions);

  return (
    <>
      {model.open && <Box className="search-scrim" onClick={model.close} />}
      <Box className={`search-palette${model.open ? ' is-open' : ''}`} role="dialog" aria-label="Search" aria-hidden={!model.open}>
        <Text as="span" className="search-palette__topedge" aria-hidden />
        <SearchInput
          inputRef={model.inputRef}
          value={model.query}
          onChange={model.setQuery}
          onKeyDown={model.handleKeyDown}
          resultCount={model.items.length}
        />
        <Box className="search-palette__body">
          <SearchResultList
            items={model.items}
            idle={model.idle}
            query={model.query}
            activeIndex={model.activeIndex}
            setActiveIndex={model.setActiveIndex}
            onSelect={model.runEntry}
          />
        </Box>
      </Box>
    </>
  );
};

export { SearchPalette };
