/* @layer renderer-shell @kind component */
import { IconButton } from '@drizztdourden08/tessera/primitives';
import { SearchSpark } from '@drizztdourden08/tessera/composites';
import { palette } from '../palette';
import { usePaletteOpen } from '../usePaletteOpen';
import type { SearchButtonProps } from './SearchButton.type';
import './SearchButton.css';

const SearchButton = (props: SearchButtonProps) => {
  const { className = '' } = props;
  const open = usePaletteOpen();
  return (
    <IconButton
      variant="ghost"
      size="sm"
      active={open}
      label="Search (Ctrl+K)"
      className={`search-button${className ? ` ${className}` : ''}`}
      onClick={palette.toggle}
    >
      <SearchSpark size={14} />
    </IconButton>
  );
};

export { SearchButton };
