/* @layer renderer-shell @kind component */
import { Box, PathIcon, Text, TextInput } from '@drizztdourden08/tessera/primitives';
import { SEARCH_ICON_PATHS } from '@drizztdourden08/tessera/composites';
import type { SearchInputProps } from './SearchInput.type';

const SearchInput = (props: SearchInputProps) => {
  const { inputRef, value, onChange, onKeyDown, resultCount } = props;
  return (
    <Box className="search-palette__input-row">
      <PathIcon paths={SEARCH_ICON_PATHS} size={16} className="search-palette__input-icon" />
      <TextInput
        ref={inputRef}
        className="search-palette__input"
        placeholder="Search screens, settings and actions"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={onKeyDown}
        role="combobox"
        aria-expanded
        aria-controls="search-palette-results"
        aria-autocomplete="list"
      />
      {value && <Text className="search-palette__count">{resultCount}</Text>}
    </Box>
  );
};

export { SearchInput };
