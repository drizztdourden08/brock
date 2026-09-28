/* @layer renderer-shell @kind component */
import { Box, Text, Toggle } from '@drizztdourden08/tessera/primitives';
import type { SearchResultRowProps } from './SearchResultRow.type';

const rowClass = (active: boolean, disabled: boolean): string =>
  ['search-row', active && 'search-row--active', disabled && 'search-row--disabled'].filter(Boolean).join(' ');

const SearchResultRow = (props: SearchResultRowProps) => {
  const { entry, active, onSelect, onHover } = props;
  const { label, icon, description, breadcrumb, checked, toggle, disabled = false } = entry;

  return (
    <Box
      className={rowClass(active, disabled)}
      role="option"
      aria-selected={active}
      aria-disabled={disabled}
      onMouseEnter={onHover}
      onClick={() => onSelect(entry)}
    >
      {icon !== undefined && <Text as="span" className="search-row__icon">{icon}</Text>}
      <Box className="search-row__text">
        <Text className="search-row__label">{label}</Text>
        {description && <Text className="search-row__description">{description}</Text>}
      </Box>
      {breadcrumb.length > 0 && <Text className="search-row__breadcrumb">{breadcrumb.join(' / ')}</Text>}
      {checked !== undefined && <Text as="span" className={`search-row__check${checked ? ' is-on' : ''}`} aria-hidden />}
      {toggle && (
        <Box className="search-row__toggle" onClick={(e) => e.stopPropagation()}>
          <Toggle checked={toggle.value} onChange={toggle.flip} aria-label={label} />
        </Box>
      )}
    </Box>
  );
};

export { SearchResultRow };
